import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

/* =======================
   Types
======================= */

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthProps {
    user: User;
}

type QuestionType =
    | 'multiple_choice'
    | 'text'
    | 'rating'
    | 'yes_no'
    | 'checkbox';

interface Question {
    question_text: string;
    type: QuestionType;
    options: string[];
    required: boolean;
}

interface AssessmentForm {
    title: string;
    description: string;
    status: 'draft' | 'published' | 'archived';
    questions: Question[];
}

interface Props {
    auth: AuthProps;
}

/* =======================
   Component
======================= */

export default function CreateAssessment({ auth }: Props) {
    const { data, setData, post, processing, errors } = useForm<AssessmentForm>({
        title: '',
        description: '',
        status: 'draft',
        questions: [
            {
                question_text: '',
                type: 'multiple_choice',
                options: [''],
                required: false,
            },
        ],
    });

    const questionTypes: { value: QuestionType; label: string }[] = [
        { value: 'multiple_choice', label: 'Multiple Choice' },
        { value: 'text', label: 'Text Answer' },
        { value: 'rating', label: 'Rating (1-5)' },
        { value: 'yes_no', label: 'Yes/No' },
        { value: 'checkbox', label: 'Multiple Select' },
    ];

    const addQuestion = (): void => {
        setData('questions', [
            ...data.questions,
            {
                question_text: '',
                type: 'multiple_choice',
                options: [''],
                required: false,
            },
        ]);
    };

    const removeQuestion = (index: number): void => {
        setData(
            'questions',
            data.questions.filter((_, i) => i !== index)
        );
    };

    const updateQuestion = <K extends keyof Question>(
        index: number,
        field: K,
        value: Question[K]
    ): void => {
        const newQuestions = [...data.questions];
        newQuestions[index][field] = value;
        setData('questions', newQuestions);
    };

    const addOption = (questionIndex: number): void => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options.push('');
        setData('questions', newQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number): void => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options = newQuestions[
            questionIndex
        ].options.filter((_, i) => i !== optionIndex);
        setData('questions', newQuestions);
    };

    const updateOption = (
        questionIndex: number,
        optionIndex: number,
        value: string
    ): void => {
        const newQuestions = [...data.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setData('questions', newQuestions);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        post('/assessments');
    };

    return (
        <AppLayout>
            <Head title="Create Assessment" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                Create New Assessment
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assessment Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                'status',
                                                e.target.value as AssessmentForm['status']
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                {/* Questions */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">
                                            Questions
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                        >
                                            + Add Question
                                        </button>
                                    </div>

                                    {data.questions.map(
                                        (question, questionIndex) => (
                                            <div
                                                key={questionIndex}
                                                className="p-4 border rounded-lg bg-gray-50 space-y-4"
                                            >
                                                {/* Question content unchanged */}
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                                    >
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Assessment'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit('/assessments')
                                        }
                                        className="px-6 py-3 bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
