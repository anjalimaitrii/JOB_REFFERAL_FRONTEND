import { X } from "lucide-react";

export default function RequestDetailsModal({ isOpen, onClose, request }: any) {
    if (!isOpen || !request) return null;

    const sender = request?.sender;
    const receiver = request?.receiver;
    const company = request?.company;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-4xl  overflow-hidden rounded-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={18} />
                    </button>

                    {/* HEADER */}
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Request Details
                        </h2>
                        <p className="text-sm text-gray-400">
                            Complete information about this request
                        </p>
                    </div>

                    {/* GRID LAYOUT */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {/* 🔹 REQUEST INFO */}
                        <Card title="Request Info">
                            <Info label="Amount" value={`₹${request.amount}`} />
                            <Info label="Status" value={request.status} />
                            <Info label="Payment" value={request.paymentStatus} />
                            <Info label="Job ID" value={request.jobId} />
                        </Card>

                        {/* 🔹 COMPANY */}
                        <Card title="Company">
                            <Info label="Name" value={company?.name} />
                            <Info label="Location" value={company?.location} />
                            <Info label="Industry" value={company?.industry} />
                        </Card>

                        {/* 🔹 SENDER */}
                        <Card title="Sender Details" full>

                            {/* PROFILE */}
                            <div className="flex items-center gap-4 mb-4">
                                {sender?.profilePhoto ? (
                                    <img
                                        src={sender.profilePhoto}
                                        className="w-14 h-14 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                        {sender?.name?.charAt(0)}
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold">{sender?.name}</p>
                                    <p className="text-xs text-gray-500">{sender?.email}</p>
                                </div>
                            </div>

                            {renderObject(sender)}
                        </Card>

                        {/* 🔹 RECEIVER */}
                        <Card title="Receiver Details" full>

                            <div className="flex items-center gap-4 mb-4">
                                {receiver?.profilePhoto ? (
                                    <img
                                        src={receiver.profilePhoto}
                                        className="w-14 h-14 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                        {receiver?.name?.charAt(0)}
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold">{receiver?.name}</p>
                                    <p className="text-xs text-gray-500">{receiver?.email}</p>
                                </div>
                            </div>

                            {renderObject(receiver)}
                        </Card>

                        {/* 🔹 DESCRIPTION */}
                        {request.description && (
                            <Card title="Description" full>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {request.description}
                                </p>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
const Card = ({ title, children, full = false }: any) => (
    <div
        className={`bg-gray-50 border rounded-2xl p-4 ${full ? "md:col-span-2" : ""
            }`}
    >
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
            {title}
        </h3>
        <div className="space-y-2">{children}</div>
    </div>
);
const renderObject = (obj: any) => {
    if (!obj) return null;

    return Object.entries(obj).map(([key, value]) => {
        if (!value || ["password", "otp", "__v", "_id", "profilePhoto", "company", "createdAt", "updatedAt", "id", "role"].includes(key)) return null;
        if (Array.isArray(value)) {

            if (typeof value[0] === "object") {
                return (
                    <div key={key} className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            {key}
                        </p>

                        <div className="space-y-2">
                            {value.map((item: any, i: number) => (
                                <div key={i} className="border rounded-lg p-2 text-sm bg-white">
                                    {Object.entries(item).map(([k, v]) => {
                                        if (!v || k === "_id" || k === "id") return null;

                                        return (
                                            <p key={k}>
                                                <span className="font-medium capitalize">{k}: </span>
                                                {v.toString()}
                                            </p>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }


            return (
                <div key={key}>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        {key}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {value.map((item: any, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white border rounded-full text-xs">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            );
        }


        if (typeof value === "object") return null;

        return <Info key={key} label={key} value={value} />;
    });
};
const Info = ({ label, value }: any) => (
    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-1">
        <span className="text-gray-500 capitalize">{label}</span>
        <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
            {value || "N/A"}
        </span>
    </div>
);