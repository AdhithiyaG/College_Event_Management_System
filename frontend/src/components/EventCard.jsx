const EventCard = ({ event, onRegister, isRegistered, loading }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isFull = event.availableSlots === 0;
  const fillPercent = Math.round(
    (event.registeredCount / event.capacity) * 100,
  );

  return (
    <div className="card p-6 flex flex-col gap-5 group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg transition-all duration-300">
          🎓
        </div>
        {isPast ? (
          <span className="badge-gray">📭 Past</span>
        ) : isFull ? (
          <span className="badge-red">❌ Full</span>
        ) : (
          <span className="badge-green">✓ Open</span>
        )}
      </div>

      {/* Title & Description */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-sm text-gray-600 relative z-10">
        <div className="flex items-center gap-3 hover:text-blue-700 transition-colors">
          <span className="text-lg">📅</span>
          <span className="font-medium">
            {eventDate.toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3 hover:text-blue-700 transition-colors">
          <span className="text-lg">🕐</span>
          <span className="font-medium">
            {eventDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3 hover:text-blue-700 transition-colors">
          <span className="text-lg">📍</span>
          <span className="font-medium truncate">{event.venue}</span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="relative z-10 pt-2">
        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
          <span className="bg-blue-50 px-2 py-1 rounded-md">
            {event.registeredCount}/{event.capacity} registered
          </span>
          <span className="bg-green-50 px-2 py-1 rounded-md">
            {event.availableSlots} slots
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-sm">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 shadow-md ${
              fillPercent >= 90
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : fillPercent >= 60
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Button */}
      {!isPast && (
        <button
          onClick={() => onRegister(event.id)}
          disabled={isRegistered || isFull || loading}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 relative z-10 ${
            isRegistered
              ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 cursor-not-allowed"
              : isFull
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:shadow-lg hover:-translate-y-0.5 shadow-md border border-blue-800 hover:border-blue-900"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Registering...
            </div>
          ) : isRegistered ? (
            "✓ Already Registered"
          ) : isFull ? (
            "Event Full"
          ) : (
            "Register Now →"
          )}
        </button>
      )}
    </div>
  );
};

export default EventCard;
