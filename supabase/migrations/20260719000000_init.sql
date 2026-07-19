-- Project 730 Initial Schema Migration with Phase 2 Enhancements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert roles
INSERT INTO public.roles (name) VALUES ('Admin'), ('Viewer') ON CONFLICT (name) DO NOTHING;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- references auth.users(id)
    name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    role_id UUID REFERENCES public.roles(id) ON DELETE RESTRICT,
    skills TEXT[] DEFAULT '{}',
    dream_company VARCHAR(255),
    current_company VARCHAR(255),
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(100),
    cover_image TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- 'Draft', 'Active', 'Archived'
    estimated_hours NUMERIC DEFAULT 0,
    difficulty VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Modules table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    estimated_hours NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    video_url TEXT,
    documentation_url TEXT,
    estimated_minutes INTEGER DEFAULT 0,
    difficulty VARCHAR(50) NOT NULL,
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL DEFAULT 'practice', -- 'practice', 'quiz', 'coding', 'upload'
    practice BOOLEAN NOT NULL DEFAULT FALSE,
    quiz BOOLEAN NOT NULL DEFAULT FALSE,
    coding BOOLEAN NOT NULL DEFAULT FALSE,
    upload BOOLEAN NOT NULL DEFAULT FALSE,
    expected_output TEXT,
    estimated_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Practice Uploads table
CREATE TABLE IF NOT EXISTS public.practice_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    image_url TEXT,
    code_url TEXT,
    notes TEXT,
    hours_spent NUMERIC DEFAULT 0,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    approved BOOLEAN NOT NULL DEFAULT FALSE
);

-- 9. Resources table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'Video', 'Documentation', 'Link', etc.
    url TEXT NOT NULL,
    provider VARCHAR(100),
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Lesson Notes table
CREATE TABLE IF NOT EXISTS public.lesson_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Quiz Questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    xp INTEGER DEFAULT 0,
    unlock_condition TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. User Achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    user_id UUID NOT NULL, -- references auth.users(id)
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, achievement_id)
);

-- 15. Daily Progress table
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    study_minutes INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    uploads INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    completion_percentage NUMERIC DEFAULT 0,
    UNIQUE(user_id, date)
);

-- 16. Study Sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    paused_at TIMESTAMPTZ,
    break_minutes INTEGER DEFAULT 0,
    device VARCHAR(100),
    location VARCHAR(100),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    duration_minutes INTEGER DEFAULT 0
);

-- 17. Journal Entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    study_session_id UUID REFERENCES public.study_sessions(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    practice_upload_id UUID REFERENCES public.practice_uploads(id) ON DELETE SET NULL,
    study_hours NUMERIC NOT NULL DEFAULT 0,
    mood VARCHAR(50) NOT NULL,
    reflection TEXT,
    tomorrow_plan TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. Finance table
CREATE TABLE IF NOT EXISTS public.finance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    salary NUMERIC NOT NULL DEFAULT 0,
    savings NUMERIC NOT NULL DEFAULT 0,
    debt NUMERIC NOT NULL DEFAULT 0,
    monthly_savings NUMERIC NOT NULL DEFAULT 0,
    investment NUMERIC NOT NULL DEFAULT 0,
    emergency_fund NUMERIC NOT NULL DEFAULT 0,
    target_salary NUMERIC NOT NULL DEFAULT 0,
    target_savings NUMERIC NOT NULL DEFAULT 0,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 19. Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    github_url TEXT,
    live_demo_url TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed'
    started_date DATE,
    completed_date DATE,
    screenshots TEXT[] DEFAULT '{}',
    notes TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 20. Certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    certificate_image_url TEXT,
    credential_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 21. Timeline table
CREATE TABLE IF NOT EXISTS public.timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- 'Career', 'Learning', 'Finance', 'Projects', 'Achievements', 'Job Switch', 'Salary Growth'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 22. Goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 23. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100) NOT NULL, -- 'Upcoming Lesson', 'Daily Reminder', 'Missed Day', etc.
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 24. User Progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- references auth.users(id)
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed', 'Revision', 'Mastered'
    completed_at TIMESTAMPTZ,
    study_hours NUMERIC DEFAULT 0,
    quiz_score INTEGER,
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id),
    CONSTRAINT chk_lesson_status CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Revision', 'Mastered'))
);

-- 25. AI Feedback table
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    feedback TEXT NOT NULL,
    score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Foreign Key Constraints referencing auth.users for schema sanity
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_auth_users FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.practice_uploads ADD CONSTRAINT fk_practice_uploads_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.lesson_notes ADD CONSTRAINT fk_lesson_notes_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_achievements ADD CONSTRAINT fk_user_achievements_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.daily_progress ADD CONSTRAINT fk_daily_progress_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.study_sessions ADD CONSTRAINT fk_study_sessions_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.journal_entries ADD CONSTRAINT fk_journal_entries_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.finance ADD CONSTRAINT fk_finance_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD CONSTRAINT fk_notifications_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_progress ADD CONSTRAINT fk_user_progress_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.ai_feedback ADD CONSTRAINT fk_ai_feedback_auth_users FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch the user's role name
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
DECLARE
    role_name text;
BEGIN
    SELECT r.name INTO role_name
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid();
    
    RETURN COALESCE(role_name, 'Viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies Setup

-- 1. Roles Policy
CREATE POLICY roles_select ON public.roles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY roles_admin ON public.roles FOR ALL USING (public.get_user_role() = 'Admin');

-- 2. Profiles Policy
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY profiles_admin ON public.profiles FOR ALL USING (public.get_user_role() = 'Admin');

-- 3. Courses Policy
CREATE POLICY courses_select ON public.courses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY courses_admin ON public.courses FOR ALL USING (public.get_user_role() = 'Admin');

-- 4. Modules Policy
CREATE POLICY modules_select ON public.modules FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY modules_admin ON public.modules FOR ALL USING (public.get_user_role() = 'Admin');

-- 5. Chapters Policy
CREATE POLICY chapters_select ON public.chapters FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY chapters_admin ON public.chapters FOR ALL USING (public.get_user_role() = 'Admin');

-- 6. Lessons Policy
CREATE POLICY lessons_select ON public.lessons FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY lessons_admin ON public.lessons FOR ALL USING (public.get_user_role() = 'Admin');

-- 7. Tasks Policy
CREATE POLICY tasks_select ON public.tasks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY tasks_admin ON public.tasks FOR ALL USING (public.get_user_role() = 'Admin');

-- 8. Practice Uploads Policy
CREATE POLICY practice_uploads_select ON public.practice_uploads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY practice_uploads_all ON public.practice_uploads FOR ALL USING (public.get_user_role() = 'Admin');

-- 9. Resources Policy
CREATE POLICY resources_select ON public.resources FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY resources_admin ON public.resources FOR ALL USING (public.get_user_role() = 'Admin');

-- 10. Lesson Notes Policy
CREATE POLICY lesson_notes_select ON public.lesson_notes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY lesson_notes_all ON public.lesson_notes FOR ALL USING (public.get_user_role() = 'Admin' OR auth.uid() = user_id);

-- 11. Quizzes Policy
CREATE POLICY quizzes_select ON public.quizzes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY quizzes_admin ON public.quizzes FOR ALL USING (public.get_user_role() = 'Admin');

-- 12. Quiz Questions Policy
CREATE POLICY quiz_questions_select ON public.quiz_questions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY quiz_questions_admin ON public.quiz_questions FOR ALL USING (public.get_user_role() = 'Admin');

-- 13. Achievements Policy
CREATE POLICY achievements_select ON public.achievements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY achievements_admin ON public.achievements FOR ALL USING (public.get_user_role() = 'Admin');

-- 14. User Achievements Policy
CREATE POLICY user_achievements_select ON public.user_achievements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY user_achievements_all ON public.user_achievements FOR ALL USING (public.get_user_role() = 'Admin');

-- 15. Daily Progress Policy
CREATE POLICY daily_progress_select ON public.daily_progress FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY daily_progress_all ON public.daily_progress FOR ALL USING (public.get_user_role() = 'Admin' OR auth.uid() = user_id);

-- 16. Study Sessions Policy
CREATE POLICY study_sessions_select ON public.study_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY study_sessions_all ON public.study_sessions FOR ALL USING (public.get_user_role() = 'Admin' OR auth.uid() = user_id);

-- 17. Journal Entries Policy
CREATE POLICY journal_entries_select ON public.journal_entries FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY journal_entries_all ON public.journal_entries FOR ALL USING (public.get_user_role() = 'Admin');

-- 18. Finance Policy
CREATE POLICY finance_select ON public.finance FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY finance_all ON public.finance FOR ALL USING (public.get_user_role() = 'Admin');

-- 19. Projects Policy
CREATE POLICY projects_select ON public.projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY projects_all ON public.projects FOR ALL USING (public.get_user_role() = 'Admin');

-- 20. Certificates Policy
CREATE POLICY certificates_select ON public.certificates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY certificates_all ON public.certificates FOR ALL USING (public.get_user_role() = 'Admin');

-- 21. Timeline Policy
CREATE POLICY timeline_select ON public.timeline FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY timeline_all ON public.timeline FOR ALL USING (public.get_user_role() = 'Admin');

-- 22. Goals Policy
CREATE POLICY goals_select ON public.goals FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY goals_all ON public.goals FOR ALL USING (public.get_user_role() = 'Admin');

-- 23. Notifications Policy
CREATE POLICY notifications_select ON public.notifications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY notifications_all ON public.notifications FOR ALL USING (public.get_user_role() = 'Admin' OR auth.uid() = user_id);

-- 24. User Progress Policy
CREATE POLICY user_progress_select ON public.user_progress FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY user_progress_all ON public.user_progress FOR ALL USING (public.get_user_role() = 'Admin' OR auth.uid() = user_id);

-- 25. AI Feedback Policy
CREATE POLICY ai_feedback_select ON public.ai_feedback FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY ai_feedback_all ON public.ai_feedback FOR ALL USING (public.get_user_role() = 'Admin');


-- Trigger for profile creation and signup restrictions
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger AS $$
DECLARE
    user_count integer;
    admin_role_id uuid;
    viewer_role_id uuid;
    assigned_role_id uuid;
BEGIN
    -- Check how many profiles currently exist
    SELECT count(*) INTO user_count FROM public.profiles;
    
    -- If there are already 2 users, reject sign up
    IF user_count >= 2 THEN
        RAISE EXCEPTION 'Registration is restricted to exactly two users.';
    END IF;
    
    -- Fetch role IDs
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'Admin';
    SELECT id INTO viewer_role_id FROM public.roles WHERE name = 'Viewer';
    
    -- First user is Admin, second is Viewer
    IF user_count = 0 THEN
        assigned_role_id := admin_role_id;
    ELSE
        assigned_role_id := viewer_role_id;
    END IF;
    
    -- Insert profile
    INSERT INTO public.profiles (id, name, role_id)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'User'),
        assigned_role_id
    );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- Initialize Storage Buckets and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('practice-images', 'practice-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for practice-images storage bucket
CREATE POLICY "practice_images_read" ON storage.objects FOR SELECT
USING (bucket_id = 'practice-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "practice_images_insert" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'practice-images' AND public.get_user_role() = 'Admin');

CREATE POLICY "practice_images_delete" ON storage.objects FOR DELETE
USING (bucket_id = 'practice-images' AND public.get_user_role() = 'Admin');

