package com.cybershield.analytics

import org.apache.flink.api.common.state.{ListState, ListStateDescriptor, ValueState, ValueStateDescriptor}
import org.apache.flink.configuration.Configuration
import org.apache.flink.streaming.api.functions.ProcessFunction
import org.apache.flink.util.Collector

import scala.collection.JavaConverters._
import scala.collection.mutable.ListBuffer
import spray.json.{JsBoolean, JsNumber, JsString}

class LearningAnalyticsStreamProcessor extends ProcessFunction[UserEvent, AnalyticsResult] {

  private var userState: ValueState[UserSessionState] = _
  private var skillState: ListState[SkillProgress] = _

  private val markovModel = new MarkovSequenceModel()
  private val learningStyleClusterer = new LearningStyleClusterer()
  private val achievementPatternDetector = new AchievementPatternDetector()
  private val anomalyDetector = LSTMAnomalyDetector.load("models/anomaly_detector")
  private val recommendationEngine = new RealTimeRecommendationEngine()

  override def open(parameters: Configuration): Unit = {
    val userDescriptor = new ValueStateDescriptor[UserSessionState]("userSessionState", classOf[UserSessionState])
    val skillDescriptor = new ListStateDescriptor[SkillProgress]("skillProgressState", classOf[SkillProgress])
    userState = getRuntimeContext.getState(userDescriptor)
    skillState = getRuntimeContext.getListState(skillDescriptor)
  }

  override def processElement(
    event: UserEvent,
    ctx: ProcessFunction[UserEvent, AnalyticsResult]#Context,
    out: Collector[AnalyticsResult]
  ): Unit = {
    val snapshot = updateUserState(event)
    val patterns = detectBehavioralPatterns(snapshot.session)
    val metrics = calculateAdvancedMetrics(event, snapshot)
    val anomalies = detectAnomalies(snapshot.session)
    val recommendations = generateRealTimeRecommendations(patterns, metrics)

    out.collect(
      AnalyticsResult(
        userId = event.userId,
        timestamp = event.timestamp,
        patterns = patterns,
        metrics = metrics,
        anomalies = anomalies,
        recommendations = recommendations
      )
    )
  }

  private def updateUserState(event: UserEvent): StateSnapshot = {
    val currentSession = Option(userState.value()).getOrElse(UserSessionState.empty(event.userId))
    val updatedSession = currentSession.recordEvent(event)
    userState.update(updatedSession)

    val existingSkills = getSkillProgress
    val updatedSkills = SkillTracker.update(existingSkills, event)
    skillState.clear()
    updatedSkills.foreach(skillState.add)

    StateSnapshot(updatedSession, updatedSkills)
  }

  private def getSkillProgress: List[SkillProgress] = {
    Option(skillState.get())
      .map(_.iterator().asScala.toList)
      .getOrElse(Nil)
  }

  private def detectBehavioralPatterns(state: UserSessionState): List[BehaviorPattern] = {
    val sequencePatterns = markovModel.detectPatterns(state.eventSequence)
    val learningPatterns = learningStyleClusterer.cluster(state.learningBehavior, state.userId)
    val achievementPatterns = achievementPatternDetector.detect(state.progress, state.userId)
    sequencePatterns ++ learningPatterns ++ achievementPatterns
  }

  private def calculateAdvancedMetrics(event: UserEvent, snapshot: StateSnapshot): AdvancedMetrics = {
    val session = snapshot.session
    AdvancedMetrics(
      engagementScore = calculateEngagementScore(event, session),
      cognitiveLoad = estimateCognitiveLoad(session),
      learningEfficiency = calculateLearningEfficiency(session),
      knowledgeRetention = estimateKnowledgeRetention(session),
      skillAcquisitionRate = calculateSkillAcquisitionRate(snapshot.skills)
    )
  }

  private def detectAnomalies(state: UserSessionState): List[AnomalyInsight] = {
    val scores = anomalyDetector.detectAnomalies(state.eventSequence)
    scores.zipWithIndex.collect {
      case (score, index) if score > 0.5 =>
        val eventOpt = state.eventSequence.lift(index)
        AnomalyInsight(
          score = score,
          description = s"Potential anomaly detected at index $index",
          eventType = eventOpt.map(_.eventType),
          timestamp = eventOpt.map(_.timestamp)
        )
    }.toList
  }

  private def generateRealTimeRecommendations(
    patterns: List[BehaviorPattern],
    metrics: AdvancedMetrics
  ): List[Recommendation] = recommendationEngine.generate(patterns, metrics)

  private def calculateEngagementScore(event: UserEvent, session: UserSessionState): Double = {
    val base = event.metadata.get("engagementScore").collect { case JsNumber(value) => value.toDouble }.getOrElse(0.5)
    val recentSimilarity = session.eventSequence.takeRight(5).count(_.eventType == event.eventType)
    val momentumBoost = math.min(0.2, recentSimilarity * 0.04)
    val streakBonus = if (session.progress.currentStreak >= 5) 0.08 else 0.0
    clamp01(base + momentumBoost + streakBonus)
  }

  private def estimateCognitiveLoad(session: UserSessionState): Double = {
    val window = session.eventSequence.takeRight(20)
    if (window.isEmpty) 0.3
    else clamp01(window.map(_.eventType).distinct.size.toDouble / 20.0)
  }

  private def calculateLearningEfficiency(session: UserSessionState): Double = {
    if (session.eventSequence.isEmpty) 0.0
    else clamp01(session.progress.completedModules.toDouble / session.eventSequence.size.toDouble)
  }

  private def estimateKnowledgeRetention(session: UserSessionState): Double = {
    if (session.progress.masteryProfile.isEmpty) 0.0
    else clamp01(session.progress.masteryProfile.values.sum / session.progress.masteryProfile.size.toDouble)
  }

  private def calculateSkillAcquisitionRate(skills: List[SkillProgress]): Double = {
    if (skills.isEmpty) 0.0
    else clamp01(skills.map(_.mastery).sum / skills.size.toDouble)
  }

  private def clamp01(value: Double): Double = math.max(0.0, math.min(1.0, value))

  private case class StateSnapshot(session: UserSessionState, skills: List[SkillProgress])
}

// -----------------------------------------------------------------------------
// Supporting domain models and helpers

case class AnalyticsResult(
  userId: String,
  timestamp: Long,
  patterns: List[BehaviorPattern],
  metrics: AdvancedMetrics,
  anomalies: List[AnomalyInsight],
  recommendations: List[Recommendation]
)

case class AdvancedMetrics(
  engagementScore: Double,
  cognitiveLoad: Double,
  learningEfficiency: Double,
  knowledgeRetention: Double,
  skillAcquisitionRate: Double
)

case class AnomalyInsight(score: Double, description: String, eventType: Option[String], timestamp: Option[Long])

case class Recommendation(message: String, priority: String, tags: Set[String] = Set.empty)

case class SkillProgress(skillId: String, mastery: Double, lastInteraction: Long)

case class UserSessionState(
  userId: String,
  eventSequence: Vector[UserEvent],
  learningBehavior: Vector[Double],
  progress: ProgressSnapshot
) {
  def recordEvent(event: UserEvent): UserSessionState = {
    val sequenceWindow = 200
    val behaviorWindow = 100

    val updatedSequence = (eventSequence :+ event).takeRight(sequenceWindow)

    val behaviorSignal = event.metadata
      .get("cognitiveSignal")
      .collect { case JsNumber(value) => value.toDouble }
      .getOrElse(0.5)

    val updatedBehavior = (learningBehavior :+ behaviorSignal).takeRight(behaviorWindow)
    val updatedProgress = progress.updateWith(event)

    copy(eventSequence = updatedSequence, learningBehavior = updatedBehavior, progress = updatedProgress)
  }
}

object UserSessionState {
  def empty(userId: String): UserSessionState =
    UserSessionState(userId, Vector.empty, Vector.empty, ProgressSnapshot())
}

case class ProgressSnapshot(
  completedModules: Int = 0,
  masteryProfile: Map[String, Double] = Map.empty,
  currentStreak: Int = 0,
  lastEventTimestamp: Long = 0L
) {
  def updateWith(event: UserEvent): ProgressSnapshot = {
    val moduleCompleted = event.metadata.get("moduleComplete").contains(JsBoolean(true))
    val updatedCompleted = completedModules + (if (moduleCompleted) 1 else 0)

    val skillId = event.metadata.get("skillId").collect { case JsString(value) => value }
    val masteryDelta = event.metadata
      .get("masteryDelta")
      .collect { case JsNumber(value) => value.toDouble }
      .getOrElse(0.0)

    val updatedMastery = skillId match {
      case Some(id) =>
        val current = masteryProfile.getOrElse(id, 0.0)
        masteryProfile.updated(id, clamp01(current + masteryDelta))
      case None => masteryProfile
    }

    val streakReset = event.metadata.get("resetStreak").contains(JsBoolean(true))
    val updatedStreak = if (streakReset) 0 else currentStreak + 1

    val updatedTimestamp = math.max(lastEventTimestamp, event.timestamp)

    copy(
      completedModules = updatedCompleted,
      masteryProfile = updatedMastery,
      currentStreak = updatedStreak,
      lastEventTimestamp = updatedTimestamp
    )
  }

  private def clamp01(value: Double): Double = math.max(0.0, math.min(1.0, value))
}

object SkillTracker {
  private val MaxSkillsTracked = 50

  def update(current: List[SkillProgress], event: UserEvent): List[SkillProgress] = {
    val skillIdOpt = event.metadata.get("skillId").collect { case JsString(value) => value }
    val masteryDelta = event.metadata
      .get("masteryDelta")
      .collect { case JsNumber(value) => value.toDouble }
      .getOrElse(0.02)

    skillIdOpt match {
      case Some(skillId) =>
        val existing = current.find(_.skillId == skillId)
        val base = existing.map(_.mastery).getOrElse(0.0)
        val updated = SkillProgress(skillId, clamp01(base + masteryDelta), event.timestamp)
        (current.filterNot(_.skillId == skillId) :+ updated)
          .sortBy(skill => -skill.mastery)
          .take(MaxSkillsTracked)
      case None => current
    }
  }

  private def clamp01(value: Double): Double = math.max(0.0, math.min(1.0, value))
}

class MarkovSequenceModel(windowSize: Int = 25) {
  def detectPatterns(events: Seq[UserEvent]): List[BehaviorPattern] = {
    if (events.size < 2) Nil
    else {
      val recent = events.takeRight(windowSize)
      val transitions = recent.sliding(2).collect {
        case Vector(prev, next) => (prev.eventType, next.eventType)
      }.toList

      val grouped = transitions.groupBy(identity).map { case (key, occurrences) => key -> occurrences.size.toDouble }
      val total = math.max(grouped.values.sum, 1.0)

      grouped.map {
        case ((from, to), count) =>
          SequencePattern(
            transition = s"$from->$to",
            probability = count / total,
            userId = events.last.userId
          )
      }.toList
    }
  }
}

case class SequencePattern(transition: String, probability: Double, userId: String) extends BehaviorPattern

class LearningStyleClusterer {
  def cluster(signals: Seq[Double], userId: String): List[BehaviorPattern] = {
    if (signals.isEmpty) Nil
    else {
      val average = signals.sum / signals.size
      val style =
        if (average >= 0.7) "Interactive"
        else if (average <= 0.3) "Reflective"
        else "Balanced"

      List(LearningStylePattern(style, confidence = math.min(1.0, math.abs(average - 0.5) * 2), userId = userId))
    }
  }
}

case class LearningStylePattern(style: String, confidence: Double, userId: String) extends BehaviorPattern

class AchievementPatternDetector {
  def detect(progress: ProgressSnapshot, userId: String): List[BehaviorPattern] = {
    val masteryAchievements = progress.masteryProfile.collect {
      case (skill, mastery) if mastery >= 0.8 =>
        AchievementPattern(s"High mastery in $skill", confidence = mastery, userId = userId)
    }

    val streakAchievement =
      if (progress.currentStreak >= 7)
        List(AchievementPattern("Consistent learning streak", math.min(1.0, progress.currentStreak / 10.0), userId))
      else Nil

    masteryAchievements.toList ++ streakAchievement
  }
}

case class AchievementPattern(description: String, confidence: Double, userId: String) extends BehaviorPattern

class RealTimeRecommendationEngine {
  def generate(patterns: List[BehaviorPattern], metrics: AdvancedMetrics): List[Recommendation] = {
    val buffer = ListBuffer.empty[Recommendation]

    if (metrics.engagementScore < 0.35)
      buffer += Recommendation("Trigger interactive challenge to boost engagement.", "high", Set("engagement"))

    if (metrics.cognitiveLoad > 0.75)
      buffer += Recommendation("Introduce scaffolding hints to reduce cognitive load.", "medium", Set("cognitive-load"))

    if (metrics.skillAcquisitionRate < 0.3)
      buffer += Recommendation("Assign targeted skill drills to accelerate mastery.", "high", Set("skill-development"))

    if (metrics.knowledgeRetention < 0.5)
      buffer += Recommendation("Schedule spaced repetition review session.", "medium", Set("retention"))

    patterns.collect { case LearningStylePattern(style, confidence, _) if confidence >= 0.4 }
      .foreach(pattern => buffer += Recommendation(s"Personalize content towards ${pattern.style} learning style.", "medium", Set("personalization")))

    patterns.collect { case AchievementPattern(description, confidence, _) if confidence >= 0.8 }
      .foreach(pattern => buffer += Recommendation(s"Celebrate achievement: $description", "low", Set("motivation")))

    buffer.distinct.toList
  }
}

// -----------------------------------------------------------------------------
// Predictive analytics engine

class PredictiveAnalyticsEngine(
  engagementModelPath: String = "models/engagement_model",
  dropoutModelPath: String = "models/dropout_model",
  anomalyModelPath: String = "models/anomaly_detector",
  collaborativeFilterPath: String = "models/collaborative_filter"
) {

  private val randomForest = RandomForestClassifier.load(engagementModelPath)
  private val xgboost = XGBoostClassifier.load(dropoutModelPath)
  private val lstm = LSTMAnomalyDetector.load(anomalyModelPath)
  private val collaborativeFilter = ALSModel.load(collaborativeFilterPath)

  def predictUserOutcomes(userId: String, features: UserFeatures): UserPredictions = {
    val engagementPrediction = randomForest.predict(features.engagementFeatures)
    val dropoutProbability = xgboost.predictProbability(features.dropoutFeatures)
    val anomalySignals = lstm.detectAnomalies(features.recentEvents)
    val achievementForecast = forecastAchievements(features.historicalData, anomalySignals)
    val adaptiveRecommendations = collaborativeFilter.recommend(userId, features.currentState)

    UserPredictions(
      engagement = engagementPrediction,
      dropoutRisk = dropoutProbability,
      achievementForecast = achievementForecast,
      recommendations = adaptiveRecommendations
    )
  }

  private def forecastAchievements(history: Seq[Double], anomalies: Seq[Double]): Double = {
    if (history.isEmpty) 0.0
    else {
      val recent = history.takeRight(12)
      val baseline = recent.sum / recent.size
      val penalty = anomalies.count(_ > 0.6) * 0.05
      math.max(0.0, baseline - penalty)
    }
  }
}

case class UserFeatures(
  engagementFeatures: Vector[Double],
  dropoutFeatures: Vector[Double],
  historicalData: Seq[Double],
  currentState: Map[String, Double],
  recentEvents: Seq[UserEvent]
)

case class UserPredictions(
  engagement: Double,
  dropoutRisk: Double,
  achievementForecast: Double,
  recommendations: List[String]
)

class XGBoostClassifier private () {
  def predictProbability(features: Vector[Double]): Double = sigmoid(features.sum / math.max(features.size, 1))
  def predictProba(features: Vector[Double]): Double = predictProbability(features)

  private def sigmoid(value: Double): Double = 1.0 / (1.0 + math.exp(-value))
}

object XGBoostClassifier {
  def load(path: String): XGBoostClassifier = new XGBoostClassifier()
}

class ALSModel private () {
  def recommend(userId: String, currentState: Map[String, Double]): List[String] = {
    if (currentState.isEmpty) List("Review foundational modules to build baseline mastery.")
    else {
      currentState.toList
        .sortBy(_._2)
        .take(3)
        .map { case (skill, score) => s"Focus on $skill to reach ${(score * 100).round}% mastery." }
    }
  }
}

object ALSModel {
  def load(path: String): ALSModel = new ALSModel()
}
