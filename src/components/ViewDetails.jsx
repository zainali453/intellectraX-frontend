import React from 'react';
import { ArrowLeft, Calendar, Clock, User, BookOpen, FileText, Info } from 'lucide-react';
import image from "../assets/english.png";

export default function ViewDetails({ email, type, data, handleBack }) {
    if (!data) return <div>No assignment selected.</div>;
    return (
        <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800" onClick={handleBack}>
                        <ArrowLeft className="w-8 h-8 font-semibold" />
                        <span className="text-4xl font-semibold my-6 mx-10 text-gray-600">{data.heading || data.title || 'Details'}</span>
                    </button>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition-colors">
                        Delete
                    </button>
                    <button className="px-4 py-2 bg-teal-500 text-white rounded-3xl hover:bg-teal-600 transition-colors">
                        Edit
                    </button>
                </div>
            </div>

            {/* Type and Email Info */}
            <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full mr-2 text-sm font-semibold">{type?.toUpperCase()}</span>
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">{email}</span>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                {/* Banner */}
                <div className="relative h-100 p-5 overflow-hidden">
                    <img src={data.image || image} alt="Card image"
                        className="w-full h-full object-cover rounded-lg mb-4 h-40" />
                </div>

                {/* Content */}
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">{data.heading || data.title || 'No Title'}</h2>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {data.description || 'No description provided.'}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {/* Assigned To */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <User className="w-4 h-4" />
                                <span>Assigned To</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-teal-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.student || data.assignedTo || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>Due Date</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.dueDate || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Assigned Date */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>Assigned Date</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.assignedDate || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <BookOpen className="w-4 h-4" />
                                <span>Subject</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.subject || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <FileText className="w-4 h-4" />
                                <span>Attachments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.attachment || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Info className="w-4 h-4" />
                                <span>Status</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Info className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="font-medium text-gray-800">{data.status || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Details Section */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden p-8'>
                {/* Submission Details */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">Submission Details</h3>
                    {/* You can add more fields here as needed, using data.submittedBy, data.submissionFile, etc. */}
                </div>
            </div>
        </div>
    );
}