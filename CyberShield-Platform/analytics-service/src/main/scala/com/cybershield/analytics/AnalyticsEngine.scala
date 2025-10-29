package com.cybershield.analytics

import akka.NotUsed
import akka.actor.ActorSystem
import akka.kafka.scaladsl.Consumer
import akka.kafka.{ConsumerSettings, Subscriptions}
import akka.stream.scaladsl.{Flow, Sink}
import org.apache.kafka.clients.consumer.ConsumerRecord
import spray.json._

import scala.concurrent.duration._

class AnalyticsEngine(consumerSettings: ConsumerSettings[String, String])(implicit system: ActorSystem) {

  import system.dispatcher
  import AnalyticsJsonProtocol._

  private val kafkaSource = Consumer
    .plainSource(consumerSettings, Subscriptions.topics("user-events"))

  def startRealTimeProcessing(): Unit = {
    kafkaSource
      .via(parseJson)
      .via(validateEvent)
      .via(enrichWithUserContext)
      .via(detectPatterns)
      .via(calculateMetrics)
      .to(Sink.foreach(storeAnalytics))
      .run()
  }

  private def parseJson: Flow[ConsumerRecord[String, String], UserEvent, NotUsed] =
    Flow[ConsumerRecord[String, String]].map { record =>
      record.value().parseJson.convertTo[UserEvent]
    }

  private def validateEvent: Flow[UserEvent, UserEvent, NotUsed] =
    Flow[UserEvent].filter(_.isValid)

  private def enrichWithUserContext: Flow[UserEvent, UserEvent, NotUsed] =
    Flow[UserEvent].mapAsync(4) { event =>
      // TODO: pull additional context from user profile service
      system.dispatcher
      scala.concurrent.Future.successful(event)
    }

  private def detectPatterns: Flow[UserEvent, DetectedPattern, NotUsed] =
    Flow[UserEvent].statefulMapConcat { () =>
      val patternDetector = new MachineLearningPatternDetector()
      var userSessions = Map[String, UserSession]()

      event =>
        val session = userSessions.getOrElse(event.userId, UserSession(event.userId))
        val updatedSession = session.addEvent(event)
        userSessions += (event.userId -> updatedSession)

        val patterns = patternDetector.detectPatterns(updatedSession)
        patterns.map(DetectedPattern(event.userId, _, event.timestamp))
    }

  private def calculateMetrics: Flow[DetectedPattern, AnalyticsMetric, NotUsed] =
    Flow[DetectedPattern]
      .groupedWithin(100, 1.second)
      .map { patterns =>
        val engagementMetrics = calculateEngagementMetrics(patterns)
        val learningMetrics = calculateLearningMetrics(patterns)
        val performanceMetrics = calculatePerformanceMetrics(patterns)

        AnalyticsMetric(
          timestamp = System.currentTimeMillis(),
          engagement = engagementMetrics,
          learning = learningMetrics,
          performance = performanceMetrics
        )
      }

  private def calculateEngagementMetrics(patterns: Seq[DetectedPattern]): Double =
    patterns.count(_.pattern.isInstanceOf[EngagementPattern]).toDouble

  private def calculateLearningMetrics(patterns: Seq[DetectedPattern]): Double =
    patterns.count(_.pattern.isInstanceOf[BehavioralClusterPattern]).toDouble

  private def calculatePerformanceMetrics(patterns: Seq[DetectedPattern]): Double =
    patterns.count(_.pattern.isInstanceOf[AnomalyPattern]).toDouble

  private def storeAnalytics(metric: AnalyticsMetric): Unit = {
    // TODO: persist metrics to analytics datastore (e.g., Cassandra, Elasticsearch)
    system.log.debug("Stored analytics metric: {}", metric)
  }
}

case class UserEvent(userId: String, eventType: String, timestamp: Long, metadata: Map[String, JsValue]) {
  def isValid: Boolean = userId.nonEmpty && eventType.nonEmpty
}

case class DetectedPattern(userId: String, pattern: BehaviorPattern, eventTimestamp: Long)

case class AnalyticsMetric(timestamp: Long, engagement: Double, learning: Double, performance: Double)

case class UserSession(userId: String, events: Vector[UserEvent] = Vector.empty) {
  def addEvent(event: UserEvent): UserSession = copy(events = events :+ event)
}

trait BehaviorPattern
case class EngagementPattern(level: Double, userId: String) extends BehaviorPattern
case class BehavioralClusterPattern(clusterId: Int, userId: String) extends BehaviorPattern
case class AnomalyPattern(anomalies: Seq[Double], userId: String) extends BehaviorPattern

object AnalyticsJsonProtocol extends DefaultJsonProtocol {
  implicit val userEventFormat: RootJsonFormat[UserEvent] = jsonFormat4(UserEvent)
}

class MachineLearningPatternDetector {

  private val randomForest = RandomForestClassifier.load("models/engagement_model")
  private val kmeans = KMeansModel.load("models/behavior_cluster_model")
  private val lstm = LSTMAnomalyDetector.load("models/anomaly_detector")

  def detectPatterns(session: UserSession): List[BehaviorPattern] = {
    val features = FeatureExtractor.extract(session)

    val engagementLevel = randomForest.predict(features.engagementFeatures)
    val behaviorCluster = kmeans.predict(features.clusterFeatures)
    val anomalies = lstm.detectAnomalies(session.events)

    List(
      EngagementPattern(engagementLevel, session.userId),
      BehavioralClusterPattern(behaviorCluster, session.userId),
      AnomalyPattern(anomalies, session.userId)
    )
  }
}

case class FeatureVector(engagementFeatures: Vector[Double], clusterFeatures: Vector[Double])

object FeatureExtractor {
  def extract(session: UserSession): FeatureVector = {
    val engagementFeatures = Vector(session.events.length.toDouble)
    val clusterFeatures = Vector(session.events.map(_.eventType.hashCode.toDouble).sum)
    FeatureVector(engagementFeatures, clusterFeatures)
  }
}

class RandomForestClassifier private () {
  def predict(features: Vector[Double]): Double = features.headOption.getOrElse(0.0)
}

object RandomForestClassifier {
  def load(path: String): RandomForestClassifier = new RandomForestClassifier()
}

class KMeansModel private () {
  def predict(features: Vector[Double]): Int = features.headOption.map(_.toInt).getOrElse(0)
}

object KMeansModel {
  def load(path: String): KMeansModel = new KMeansModel()
}

class LSTMAnomalyDetector private () {
  def detectAnomalies(events: Seq[UserEvent]): Seq[Double] = events.map(_ => 0.0)
}

object LSTMAnomalyDetector {
  def load(path: String): LSTMAnomalyDetector = new LSTMAnomalyDetector()
}
