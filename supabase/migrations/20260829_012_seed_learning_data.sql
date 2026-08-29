BEGIN;

INSERT INTO public.instructors (id, name, initials, bio) VALUES
  ('i1', 'Maya Okafor', 'MO', 'A performance coach helping members build calm, repeatable practices for high-pressure decisions.'),
  ('i2', 'Jon Bell', 'JB', 'A risk educator focused on process, position sizing and the habits that keep traders in the game.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, title, subtitle, category, description, level, lesson_count, tier, cover_label, instructor_id, duration_minutes) VALUES
  ('mind-lab', 'Mind Lab', 'Build the inner habits that make consistency possible.', 'Mind Lab', 'A five-part practice for emotional awareness, focus and honest self-review. Progress is built in ordinary moments.', 'foundation', 5, 'free', 'Awareness / Practice', 'i1', 81),
  ('trading-room', 'Trading Room', 'Process over prediction. Risk before reward.', 'Trading Room', 'An educational track for building a grounded trading process, from risk definition to objective review.', 'intermediate', 6, 'member', 'Process / Risk', 'i2', 117)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_objectives (id, course_id, label, sort_order) VALUES
  ('mind-lab-objective-0', 'mind-lab', 'Recognise emotional triggers.', 0),
  ('mind-lab-objective-1', 'mind-lab', 'Build a consistent daily practice.', 1),
  ('mind-lab-objective-2', 'mind-lab', 'Improve focus and self-awareness.', 2),
  ('mind-lab-objective-3', 'mind-lab', 'Respond instead of reacting.', 3),
  ('mind-lab-objective-4', 'mind-lab', 'Review setbacks honestly.', 4),
  ('trading-room-objective-0', 'trading-room', 'Understand the role of trading psychology.', 5),
  ('trading-room-objective-1', 'trading-room', 'Create a basic trading plan.', 6),
  ('trading-room-objective-2', 'trading-room', 'Define and manage risk.', 7),
  ('trading-room-objective-3', 'trading-room', 'Journal trading decisions.', 8),
  ('trading-room-objective-4', 'trading-room', 'Review execution objectively.', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, course_id, title, description, duration_minutes, sort_order, summary, content) VALUES
  ('ml1', 'mind-lab', 'The Mind Is the First Market', 'Notice the stories running underneath every decision.', 12, 1, 'A grounded introduction to attention and choice.', '{"introduction":"Before we can change a behaviour, we need to notice the moment it begins.","teaching":["Attention is a limited resource. What you repeatedly notice becomes what you repeatedly practise.","Emotional awareness is not a demand to feel less. It is the ability to name what is present without handing it the steering wheel."],"example":{"title":"A small pause","body":"You feel the urge to abandon a routine. Rather than arguing with the urge, name it: ‘I am feeling resistance.’ That small act creates room for a different response."},"exercise":"Set a two-minute timer. Write down three sensations, two emotions and one thought without trying to fix any of them.","takeaways":["Notice before you navigate.","Naming a feeling is not the same as obeying it.","Small pauses compound."],"reflection":"What did you notice today that you normally rush past?"}'::jsonb),
  ('ml2', 'mind-lab', 'Understanding Emotional Triggers', 'Map the moments that pull you away from your intention.', 18, 2, 'Build a useful map of your triggers and responses.', '{"introduction":"Triggers are signals, not verdicts. They show us where attention and care are needed.","teaching":["A trigger usually arrives before the story we tell about it. Learning the sequence gives you a place to intervene.","Use the chain: event, sensation, interpretation, impulse, choice. The choice is the part you can train."],"example":{"title":"The unanswered message","body":"An unanswered message becomes a tight chest, then a story about rejection, then an impulse to send three more messages. The pause lives between the sensation and the story."},"exercise":"Complete one trigger chain from the last 24 hours. Circle the first point where a pause could have changed your next action.","takeaways":["Triggers are information.","The body often notices first.","One pause is a successful practice."],"reflection":"Which interpretation do you reach for most quickly?"}'::jsonb),
  ('ml3', 'mind-lab', 'Discipline When Motivation Fades', 'Make the next right action smaller than the resistance.', 16, 3, 'Design consistency for ordinary days.', NULL),
  ('ml4', 'mind-lab', 'Building a Consistent Routine', 'Create a practice that can survive a busy week.', 20, 4, 'Turn intention into a repeatable ritual.', NULL),
  ('ml5', 'mind-lab', 'The Weekly Self-Review', 'Review setbacks with honesty and without punishment.', 15, 5, 'Use reflection to improve the next week.', NULL),
  ('tr1', 'trading-room', 'Your Emotions Are Part of the Trade', 'Build awareness before you build a position.', 14, 1, 'A process-first look at trading psychology.', NULL),
  ('tr2', 'trading-room', 'Risk Before Reward', 'Define what you can lose before considering what you could make.', 22, 2, 'Risk management is the foundation of survival.', '{"introduction":"A trade is not defined by its upside. It is defined first by the risk you are willing and able to carry.","teaching":["Risk is a decision made before entry, not a feeling managed after the market moves.","A simple plan makes risk visible: invalidation, position size, maximum loss and the conditions that end the idea."],"example":{"title":"The clean pass","body":"A setup looks attractive, but its invalidation sits too far away for your defined risk. The process-first decision is to pass, not to stretch the rules."},"exercise":"On paper, write a hypothetical setup and define the invalidation, maximum loss and exact reason you would walk away.","takeaways":["Risk comes before reward.","A pass can be a high-quality decision.","Paper practice builds clarity without capital at risk."],"reflection":"Where are you most tempted to negotiate with your own risk limit?"}'::jsonb),
  ('tr3', 'trading-room', 'Building a Trading Plan', 'Turn vague confidence into observable rules.', 24, 3, 'Write a plan you can actually review.', NULL),
  ('tr4', 'trading-room', 'The Purpose of a Trading Journal', 'Capture decisions, not just outcomes.', 17, 4, 'Journal for feedback, not self-judgement.', NULL),
  ('tr5', 'trading-room', 'Reviewing a Losing Trade', 'Separate process quality from outcome noise.', 19, 5, 'Learn without letting ego edit the record.', NULL),
  ('tr6', 'trading-room', 'Practising Before Risking Capital', 'Rehearse the process before adding pressure.', 21, 6, 'Paper practice before real risk.', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lesson_resources (id, lesson_id, title, type) VALUES
  ('r1', 'ml2', 'Trigger mapping worksheet', 'worksheet'),
  ('r2', 'tr2', 'Risk planning template', 'template')
ON CONFLICT (id) DO NOTHING;

COMMIT;
