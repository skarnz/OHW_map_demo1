# Patient Journey Analysis - OHW Weight Management Program

## Executive Summary

The OHW patient journey is a comprehensive 12-month weight management program that combines medical intervention (GLP-1 medications), behavioral modification, and educational support. The journey is structured in distinct phases with decreasing visit frequency as patients progress toward independence.

## Journey Architecture

### Timeline Structure
```
Weeks 0-8:    Weekly visits (9 visits)
Weeks 9-16:   Bi-weekly visits (4 visits)  
Months 5-12:  Monthly visits (6 visits)
Total:        22 visits over 12 months
```

### Visit Duration Model
- Initial Visit (NPV): 30 minutes
- Return Visits (RPV): 15 minutes (standard), 30 minutes (final visit)

## Key Milestones

### 1. Program Entry (Week 0)
- **Patient Actions**: Complete questionnaire, provide labs, consent to program
- **Provider Actions**: Assessment, goal setting, initial measurements
- **System Actions**: Chart creation, appointment scheduling, tracking tool activation
- **Outcome**: First medication dose (if applicable), personalized plan established

### 2. Habit Formation (Weeks 1-4)
- **Focus**: Establishing tracking routines and basic behavioral changes
- **Key Metrics**: Daily food logging, weekly fitness minutes, medication compliance
- **Support**: Weekly microlearning modules, provider check-ins
- **Milestone**: First progress photo and comprehensive review at Week 4

### 3. Skill Development (Weeks 5-8)
- **Focus**: Advanced strategies for sustainable weight loss
- **New Elements**: Problem-solving techniques, eating out strategies, medication self-management
- **Support**: Continued weekly visits with dose optimization
- **Milestone**: Week 8 comprehensive assessment and phase transition

### 4. Independence Building (Weeks 9-16)
- **Focus**: Reducing visit frequency while maintaining progress
- **Transition**: From medication administration to distribution
- **New Skills**: Stress management, plateau navigation, environmental control
- **Milestone**: Week 15 lab work for progress validation

### 5. Maintenance Preparation (Months 5-9)
- **Focus**: Monthly check-ins with emphasis on self-management
- **Advanced Topics**: Long-term motivation, special event navigation, variety in routines
- **Decision Points**: Medication titration, maintenance plan development
- **Milestone**: 6-month comprehensive review

### 6. Program Graduation (Months 10-12)
- **Focus**: Transition planning and long-term sustainability
- **Final Assessments**: Progress review, milestone celebration, future planning
- **Options**: Graduate to maintenance, continue monthly support, or program completion
- **Milestone**: 12-month final assessment and graduation

## Critical Touchpoints

### Clinical Touchpoints
1. **Lab Reviews**: Initial and Week 15
2. **Photo Documentation**: Weeks 0, 4, 8, then monthly
3. **Medication Adjustments**: Weekly (Weeks 1-8), then at each visit
4. **Comprehensive Reviews**: Weeks 4, 8, Month 6, Month 12

### Educational Touchpoints
1. **Onboarding Education**: Program introduction, goal setting, tool training
2. **Weekly Microlearning**: 52 modules covering all aspects of weight management
3. **Query Response System**: AI-powered 24/7 support for questions
4. **Progress Reviews**: Goal adjustment and strategy refinement at each visit

### Behavioral Touchpoints
1. **Daily**: Food tracking, medication (if applicable)
2. **Weekly**: Fitness minute goals, weight/measurement tracking
3. **Bi-weekly/Monthly**: Provider accountability visits
4. **Quarterly**: Major progress reviews and plan adjustments

## User Flow Patterns

### Standard Visit Flow (5A Framework)
```
1. Assess → Measure weight/waist/photos
2. Advise → Review tracking data and progress
3. Agree → Collaborative goal review/adjustment
4. Assist → Medication management, problem-solving
5. Arrange → Schedule follow-up, assign microlearning
```

### Patient App Interaction Flow
```
Daily: Log meals → Track fitness → Review progress → Access microlearning
Weekly: Submit data → Receive feedback → Adjust goals → Prepare for visit
Visit Day: Check-in → Provider review → Update plan → Confirm next steps
```

### Support Escalation Flow
```
Self-Service (App) → AI-Powered Assistance → Provider Message → Clinic Call → Emergency Pathway
```

## Technology Integration Points

### Data Collection Systems
- Electronic health records (EHR) integration
- Mobile app for tracking and education
- Photo documentation system
- Lab result integration
- Medication tracking

### Communication Channels
- In-person visits (primary)
- App-based messaging
- Automated reminders (appointments, tracking, education)
- 24/7 AI support system
- Emergency escalation pathway

### Analytics and Reporting
- Individual progress dashboards
- Provider summary views
- Population health metrics
- Outcome tracking and reporting

## Success Factors

### Patient Success Indicators
- Consistent tracking compliance (>80%)
- Visit attendance (>90%)
- Goal achievement rates
- Medication adherence (if applicable)
- Microlearning engagement

### Program Success Metrics
- Average weight loss: Target 5-10% of body weight
- Program completion rate: Target >70%
- Maintenance success: >60% maintain loss at 6 months post-program
- Patient satisfaction: >4.5/5 rating
- Clinical outcome improvements: BP, glucose, lipids

### Critical Success Dependencies
1. **Technology**: Reliable app and tracking systems
2. **Provider Training**: Consistent 5A framework implementation
3. **Patient Education**: Engaging, relevant microlearning content
4. **Support Systems**: 24/7 assistance availability
5. **Flexibility**: Ability to customize journey based on patient needs

## Risk Mitigation Strategies

### Common Failure Points
1. **Week 3-4**: Initial enthusiasm wanes → Enhanced support and first milestone review
2. **Week 9**: Transition to bi-weekly → Clear communication about continued progress
3. **Month 4-5**: Plateau frustration → Advanced problem-solving modules
4. **Month 9-10**: Pre-graduation anxiety → Maintenance planning and support options

### Mitigation Approaches
- Proactive outreach at high-risk timepoints
- Flexible visit scheduling for life events
- Multiple support channels (app, AI, human)
- Clear escalation pathways
- Celebration of non-scale victories

## Recommendations for Implementation

1. **Phased Rollout**: Start with GLP-1 track, add DPP after stabilization
2. **Staff Training**: Comprehensive 5A framework and technology training
3. **Technology Testing**: Pilot app with small cohort before full launch
4. **Content Development**: Complete microlearning library before launch
5. **Feedback Loops**: Monthly review of patient progress and program adjustments
6. **Partnership Development**: Establish lab, pharmacy, and emergency partnerships
7. **Quality Assurance**: Regular audits of visit consistency and documentation