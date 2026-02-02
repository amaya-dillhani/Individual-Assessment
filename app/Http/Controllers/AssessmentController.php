<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentResponse;
use App\Models\Question;
use App\Models\QuestionAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    // Show list of assessments
    public function index()
    {
        $assessments = Assessment::with('questions')
            ->where('status', 'published')
            ->latest()
            ->get();

        return Inertia::render('assessments/Index', [
            'assessments' => $assessments,
        ]);
    }

    // Show create assessment form
    public function create()
    {
        return Inertia::render('assessments/Create');
    }

    // Store new assessment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.type' => 'required|in:multiple_choice,text,rating,yes_no,checkbox',
            'questions.*.options' => 'nullable|array',
            'questions.*.required' => 'boolean',
        ]);

        $assessment = Assessment::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'],
        ]);

        foreach ($validated['questions'] as $index => $questionData) {
            Question::create([
                'assessment_id' => $assessment->id,
                'question_text' => $questionData['question_text'],
                'type' => $questionData['type'],
                'options' => $questionData['options'] ?? null,
                'required' => $questionData['required'] ?? false,
                'order' => $index,
            ]);
        }

        return redirect('/assessments')
            ->with('success', 'Assessment created successfully!');
    }

    // Show single assessment for taking
    public function show(Assessment $assessment)
    {
        $assessment->load('questions');

        return Inertia::render('assessments/Show', [
            'assessment' => $assessment,
        ]);
    }

    // Submit assessment response
    public function submit(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required',
        ]);

        $response = AssessmentResponse::create([
            'assessment_id' => $assessment->id,
            'user_id' => auth()->id(),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            QuestionAnswer::create([
                'response_id' => $response->id,
                'question_id' => $questionId,
                'answer' => is_array($answer) ? json_encode($answer) : $answer,
            ]);
        }

        return redirect('/assessments')
            ->with('success', 'Thank you for completing the assessment!');
    }
}