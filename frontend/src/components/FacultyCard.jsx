function FacultyCard({ faculty }) {
  const initials = faculty.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow">
      {faculty.photo_url ? (
        <img
          src={faculty.photo_url}
          alt={faculty.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{faculty.name}</h3>
        <p className="text-sm text-gray-500">{faculty.designation}</p>
        <p className="text-sm text-gray-500">{faculty.department}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {faculty.cabin_no && (
            <span className="inline-flex items-center gap-1 text-gray-700">
              📍 Cabin: <span className="font-medium">{faculty.cabin_no}</span>
            </span>
          )}
          {faculty.email && (
            <span className="text-gray-500 truncate">{faculty.email}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default FacultyCard
