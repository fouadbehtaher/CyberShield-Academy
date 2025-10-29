package com.cybershield.platform.core.architecture.user;

import com.cybershield.platform.core.architecture.annotations.Aggregate;
import com.cybershield.platform.core.architecture.annotations.AggregateIdentifier;
import com.cybershield.platform.core.architecture.annotations.CommandHandler;
import com.cybershield.platform.core.architecture.annotations.EventSourcingHandler;
import com.cybershield.platform.core.architecture.user.commands.CompleteModuleCommand;
import com.cybershield.platform.core.architecture.user.commands.CreateUserCommand;
import com.cybershield.platform.core.architecture.user.events.ModuleCompletedEvent;
import com.cybershield.platform.core.architecture.user.events.UserCreatedEvent;
import com.cybershield.platform.core.architecture.user.model.AbstractAggregateRoot;
import com.cybershield.platform.core.architecture.user.model.IllegalModuleCompletionException;
import com.cybershield.platform.core.architecture.user.model.LearningProgress;
import com.cybershield.platform.core.architecture.user.model.Module;
import com.cybershield.platform.core.architecture.user.model.ModuleRepository;
import com.cybershield.platform.core.architecture.user.model.Skill;
import com.cybershield.platform.core.architecture.user.model.UserProfile;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Aggregate
public class UserAggregate extends AbstractAggregateRoot {

    @AggregateIdentifier
    private String userId;

    private UserProfile profile;
    private LearningProgress progress;
    private Set<Skill> acquiredSkills;

    private transient ModuleRepository moduleRepository;

    public UserAggregate() {
        // framework requirement
    }

    public void setModuleRepository(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @CommandHandler
    public UserAggregate(CreateUserCommand command) {
        apply(new UserCreatedEvent(
            command.getUserId(),
            command.getProfile(),
            command.getInitialSkills()
        ));
    }

    @CommandHandler
    public void handle(CompleteModuleCommand command) {
        if (!canCompleteModule(command.getModuleId())) {
            throw new IllegalModuleCompletionException(
                "Prerequisites not met for module: " + command.getModuleId()
            );
        }

        apply(new ModuleCompletedEvent(
            userId,
            command.getModuleId(),
            command.getScore(),
            command.getTimestamp()
        ));
    }

    private boolean canCompleteModule(String moduleId) {
        if (moduleRepository == null) {
            return true;
        }

        return moduleRepository.findById(moduleId)
            .map(this::prerequisitesSatisfied)
            .orElse(true);
    }

    private boolean prerequisitesSatisfied(Module module) {
        if (acquiredSkills == null || module.getGrantedSkills() == null) {
            return true;
        }
        return acquiredSkills.containsAll(module.getGrantedSkills());
    }

    @Override
    protected void handleEvent(Object event) {
        if (event instanceof UserCreatedEvent userCreatedEvent) {
            on(userCreatedEvent);
        } else if (event instanceof ModuleCompletedEvent moduleCompletedEvent) {
            on(moduleCompletedEvent);
        }
    }

    @EventSourcingHandler
    public void on(UserCreatedEvent event) {
        this.userId = event.getUserId();
        this.profile = event.getProfile();
        this.acquiredSkills = new HashSet<>(event.getInitialSkills());
        this.progress = new LearningProgress();
    }

    @EventSourcingHandler
    public void on(ModuleCompletedEvent event) {
        if (progress == null) {
            progress = new LearningProgress();
        }
        progress.recordCompletion(event.getModuleId(), event.getScore(), event.getTimestamp());

        if (moduleRepository != null) {
            moduleRepository.findById(event.getModuleId())
                .ifPresent(module -> this.acquiredSkills.addAll(module.getGrantedSkills()));
        }
    }

    public String getUserId() {
        return userId;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public LearningProgress getProgress() {
        return progress;
    }

    public Set<Skill> getAcquiredSkills() {
        return acquiredSkills == null ? Set.of() : Set.copyOf(acquiredSkills);
    }

    public void replay(UserCreatedEvent event) {
        on(event);
    }

    public void replay(ModuleCompletedEvent event) {
        on(event);
    }

    public void rehydrate(Set<Object> pastEvents) {
        pastEvents.forEach(this::handleEvent);
    }
}
