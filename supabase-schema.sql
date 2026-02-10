-- Create homework table
CREATE TABLE homework (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class TEXT NOT NULL,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('homework', 'test', 'project')),
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    day TEXT NOT NULL,
    month TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for homework table
CREATE POLICY "Users can view their own homework" 
    ON homework FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own homework" 
    ON homework FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own homework" 
    ON homework FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own homework" 
    ON homework FOR DELETE 
    USING (auth.uid() = user_id);

-- Create policies for tasks table
CREATE POLICY "Users can view their own tasks" 
    ON tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
    ON tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
    ON tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
    ON tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- Create policies for events table
CREATE POLICY "Users can view their own events" 
    ON events FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" 
    ON events FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
    ON events FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
    ON events FOR DELETE 
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_homework_user_id ON homework(user_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
