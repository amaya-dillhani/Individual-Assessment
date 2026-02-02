import React from 'react';
import { Head, Link } from '@inertiajs/react';
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

type AssessmentStatus = 'draft' | 'published' | 'archived';

interface Assessment {
    id: number;
    title: string;
    description?: string | null;
    status: AssessmentStatus;
    questions: unknown[];
}

interface Props {
    auth: AuthProps;
    assessments: Assessment[];
}

/* =======================
   Component
======================= */

export default function AssessmentIndex({ auth, assessments }: Props) {
    return (
        <AppLayout>
            <Head title="Assessments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Assessments
                        </h1>
                        <Link
                            href="/assessments/create"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create New Assessment
                        </Link>
                    </div>

                    {/* Assessments Grid */}
                    {assessments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                No assessments yet
                            </h3>
                            <p className="mt-1 text-gray-500">
                                Get started by creating a new assessment.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/assessments/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <svg
                                        className="-ml-1 mr-2 h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Create Assessment
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assessments.map((assessment) => (
                                <div
                                    key={assessment.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                                {assessment.title}
                                            </h2>
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                    assessment.status ===
                                                    'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : assessment.status ===
                                                          'draft'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {assessment.status}
                                            </span>
                                        </div>

                                        {assessment.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {assessment.description}
                                            </p>
                                        )}

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>
                                                {assessment.questions.length}{' '}
                                                {assessment.questions.length ===
                                                1
                                                    ? 'question'
                                                    : 'questions'}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/assessments/${assessment.id}`}
                                            className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Take Assessment
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
