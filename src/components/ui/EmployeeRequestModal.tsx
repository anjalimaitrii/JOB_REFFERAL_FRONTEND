import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any;
    onAccept: () => void;
    onReject: () => void;
    onComplete: () => void;
}

export default function EmployeeRequestModal({
    isOpen,
    onClose,
    request,
    onAccept,
    onReject,
    onComplete,
}: RequestModalProps) {
    if (!isOpen || !request) return null;

    const sender = request?.sender;
    const [currentStatus, setCurrentStatus] = useState(request?.status);

    useEffect(() => {
        setCurrentStatus(request?.status);
    }, [request]);


    const status =
        currentStatus === "pending"
            ? "Pending"
            : currentStatus === "accepted"
                ? "Approved"
                : currentStatus === "completed"
                    ? "Completed"
                    : "Rejected";

    const statusBadge = {
        Approved: "bg-black text-white",
        Rejected: "bg-gray-200 text-gray-600",
        Pending: "bg-gray-100 text-gray-500",
        Completed: "bg-green-100 text-green-600",
    }[status];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl border border-gray-200 p-6 relative">

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100"
                >
                    <X size={18} />
                </button>

                <h2 className="text-xl font-bold mb-6">Aspirant Request Details</h2>

                {/* PROFILE */}
                <div className="flex items-center justify-between mb-6">

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-4">
                        {sender?.profilePhoto ? (
                            <img
                                src={sender.profilePhoto}
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
                                {sender?.name?.charAt(0)}
                            </div>
                        )}

                        <div>
                            <p className="text-lg font-semibold">{sender?.name}</p>
                        </div>
                    </div>

                    {/* ✅ STATUS BADGE RIGHT SIDE */}
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${currentStatus === "pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : currentStatus === "accepted"
                            ? "bg-green-50 text-green-700"
                            : currentStatus === "completed"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-red-50 text-red-700"
                        }`}>
                        {status}
                    </span>

                </div>

                {/* BASIC DETAILS */}
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">
                            Basic Details
                        </h3>


                    </div>

                    {sender?.experience?.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                                Experience
                            </h3>

                            <div className="space-y-3">
                                {sender.experience.map((exp: any, i: number) => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-3 text-sm space-y-1"
                                    >

                                        {/* Company */}
                                        <p className="font-semibold text-gray-900">
                                            {exp.company}
                                        </p>

                                        {/* Role */}
                                        {exp.role && (
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Role:</span> {exp.role}
                                            </p>
                                        )}

                                        {/* Duration */}
                                        {(exp.startDate || exp.endDate) && (
                                            <p className="text-xs text-gray-500">
                                                {exp.startDate} - {exp.endDate || "Present"}
                                            </p>
                                        )}

                                        {/* Location */}
                                        {exp.location && (
                                            <p className="text-xs text-gray-500">
                                                {exp.location}
                                            </p>
                                        )}

                                        {/* Description */}
                                        {exp.description && (
                                            <p className="text-xs text-gray-500">
                                                {exp.description}
                                            </p>
                                        )}

                                    </div>
                                ))}

                            </div>
                        </section>
                    )}
                </section>

                {/* SKILLS */}


                {
                    sender?.skills?.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                                Skills
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {sender.skills.map((skill: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-gray-100 text-xs rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )
                }

                {/* EDUCATION */}
                {
                    sender?.education?.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                                Education
                            </h3>

                            <div className="space-y-2">
                                {sender.education.map((edu: any, i: number) => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-3 text-sm bg-gray-50"
                                    >
                                        <p className="font-semibold">
                                            {edu.level || edu.degree}
                                        </p>
                                        <p className="text-gray-500">
                                            {edu.school || edu.institute}
                                        </p>
                                        {edu.year && (
                                            <p className="text-xs text-gray-400">{edu.year}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }

                {/* PROJECTS */}
                {
                    sender?.projects?.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                                Projects
                            </h3>

                            <div className="space-y-3">
                                {sender.projects.map((project: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-3 text-sm space-y-1">

                                        {/* Project Title */}
                                        <p className="font-semibold text-gray-900">
                                            {project.title}
                                        </p>

                                        {/* Project Name */}
                                        {project.name && (
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Name:</span> {project.name}
                                            </p>
                                        )}

                                        {/* Description */}
                                        {project.description && (
                                            <p className="text-gray-500 text-xs">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Link */}
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                className="text-blue-500 text-xs hover:underline"
                                            >
                                                View Project
                                            </a>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </section>
                    )
                }

                {/* EXPERIENCE */}
                {
                    sender?.experience?.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                                Experience
                            </h3>

                            {sender.experience.map((exp: any, i: number) => (
                                <div
                                    key={i}
                                    className="border rounded-lg p-3 text-sm mb-2"
                                >
                                    <p className="font-semibold">{exp.company}</p>
                                    {exp.role && (
                                        <p className="text-gray-500 text-xs">{exp.role}</p>
                                    )}
                                </div>
                            ))}
                        </section>
                    )
                }
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
                        Description
                    </h3>
                    <div className="border rounded-lg p-3 text-sm mb-2 text-gray-900" >{request.description}</div>
                </section>
                <div className="mt-6 flex flex-col gap-3">

                    {/* PENDING */}
                    {currentStatus === "pending" && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    onAccept();
                                    setCurrentStatus("accepted");
                                }}
                                className="flex-1 py-2 rounded-xl bg-black text-white text-sm font-bold uppercase"
                            >
                                Accept
                            </button>

                            <button
                                onClick={() => {
                                    onReject();
                                    setCurrentStatus("rejected");
                                }}
                                className="flex-1 py-2 rounded-xl border border-gray-300 text-sm font-bold uppercase"
                            >
                                Reject
                            </button>
                        </div>
                    )}

                    {/* ACCEPTED */}
                    {currentStatus === "accepted" && request?.paymentStatus === "paid" && (
                        <button
                            onClick={() => {
                                const confirmComplete = window.confirm(
                                    "Are you sure you have submitted the referral?"
                                );

                                if (confirmComplete) {
                                    onComplete();
                                    setCurrentStatus("completed");
                                }
                            }}
                            className="w-full py-2 rounded-xl bg-black text-white text-sm font-bold uppercase"
                        >
                            Mark as Completed
                        </button>
                    )}

                    {/* COMPLETED */}
                    {currentStatus === "completed" && (
                        <div className="text-center text-sm font-bold text-blue-600">
                            Completed ✔
                        </div>
                    )}

                    {/* REJECTED */}
                    {currentStatus === "rejected" && (
                        <div className="text-center text-sm font-bold text-red-500">
                            Rejected
                        </div>
                    )}

                </div>
            </div >
        </div >
    );
}

const Info = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between border-b border-gray-100 pb-1">
        <span className="text-gray-500">{label}</span>
        <span className="ml-2 font-medium">{value || "N/A"}</span>
    </div>
);