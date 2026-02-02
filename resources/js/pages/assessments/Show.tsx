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
    | 'checkbox'
    | 'text'
    | 'rating'
    | 'yes_no';

interface Question {
    id: number;
    question_text: string;
    type: QuestionType;
    options: string[];
    required: boolean;
}

interface Assessment {
    id: number;
    title: string;
    description?: string | null;
    questions: Question[];
}

type AnswerValue = string | number | string[];

interface FormData {
    answers: Record<number, AnswerValue>;
}

interface Props {
    auth: AuthProps;
    assessment: Assessment;
}

/* =======================
   Component
======================= */

export default function ShowAssessment({ auth, assessment }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        answers: {},
    });

    const handleAnswerChange = (
        questionId: number,
        value: AnswerValue
    ): void => {
        setData('answers', {
            ...data.answers,
            [questionId]: value,
        });
    };

    const handleCheckboxChange = (
        questionId: number,
        optionValue: string
    ): void => {
        const currentAnswers =
            (data.answers[questionId] as string[]) || [];

        const newAnswers = currentAnswers.includes(optionValue)
            ? currentAnswers.filter((v) => v !== optionValue)
            : [...currentAnswers, optionValue];

        handleAnswerChange(questionId, newAnswers);
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        post(`/assessments/${assessment.id}/submit`);
    };

    const renderQuestion = (question: Question): JSX.Element | null => {
        switch (question.type) {
            case 'multiple_choice':
                return (
                    <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-3 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={
                                        data.answers[question.id] === option
                                    }
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            question.id,
                                            e.target.value
                                        )
                                    }
                                    className="h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="text-gray-700">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={(
                                        (data.answers[
                                            question.id
                                        ] as string[]) || []
                                    ).includes(option)}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            question.id,
                                            option
                                        )
                                    }
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'text':
                return (
                    <textarea
                        value={(data.answers[question.id] as string) || ''}
                        onChange={(e) =>
                            handleAnswerChange(
                                question.id,
                                e.target.value
                            )
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter your answer here..."
                    />
                );

            case 'rating':
                return (
                    <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <label
                                key={rating}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={rating}
                                    checked={
                                        data.answers[question.id] ==
                                        rating
                                    }
                                    onChange={() =>
                                        handleAnswerChange(
                                            question.id,
                                            rating
                                        )
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                                        data.answers[question.id] ==
                                        rating
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                                    }`}
                                >
                                    {rating}
                                </div>
                            </label>
                        ))}
                    </div>
                );

            case 'yes_no':
                return (
                    <div className="flex space-x-4">
                        {['Yes', 'No'].map((option) => (
                            <label
                                key={option}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={option}
                                    checked={
                                        data.answers[question.id] ===
                                        option
                                    }
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            question.id,
                                            e.target.value
                                        )
                                    }
                                    className="h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="font-medium text-gray-700">
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title={assessment.title} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg">
                        <div className="p-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {assessment.title}
                                </h1>
                                {assessment.description && (
                                    <p className="text-gray-600 mt-2">
                                        {assessment.description}
                                    </p>
                                )}
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                {assessment.questions.map(
                                    (question, index) => (
                                        <div
                                            key={question.id}
                                            className="p-6 bg-gray-50 rounded-lg border"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {index + 1}.{' '}
                                                {question.question_text}
                                                {question.required && (
                                                    <span className="text-red-500 ml-1">
                                                        *
                                                    </span>
                                                )}
                                            </h3>

                                            {renderQuestion(question)}

                                            {errors[
                                                `answers.${question.id}`
                                            ] && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {
                                                        errors[
                                                            `answers.${question.id}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Submitting...'
                                            : 'Submit Assessment'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit('/assessments')
                                        }
                                        className="px-8 py-3 bg-gray-200 rounded-lg"
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
