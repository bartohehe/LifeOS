ANALYZE_DAY_PROMPT = """
You are a life coach AI assistant. Analyze the user's day based on their logged activities.

User: {username}
Date: {date}
Activities:
{activities}

Provide:
1. A summary of the day
2. Key achievements
3. Areas for improvement
4. Motivational insight
"""

PLAN_DAY_PROMPT = """
You are a life coach AI assistant. Create a personalized day plan for the user.

User: {username}
Current stats: {stats}
Recent activities: {recent_activities}
Date: {date}

Create a structured daily plan with:
1. Morning routine
2. Focus tasks (2-3 high-priority items)
3. Health & fitness
4. Evening wind-down
"""
