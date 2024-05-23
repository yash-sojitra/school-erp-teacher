const AttendanceOver = () => {
  return (
    <div className="flex flex-wrap gap-6 w-full justify-center">
      <div className="bg-white flex flex-col items-center rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-1/3">
        <h1 className="text-xl lg:text-2xl font-bold">Total Students</h1>
        <p className="text-4xl font-bold my-6 text-primary-foreground">20</p>
      </div>
      <div className="bg-white flex flex-col items-center rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-1/3">
        <h1 className="text-xl lg:text-2xl font-bold">Present Students</h1>
        <p className="text-4xl font-bold my-6 text-primary-foreground">18</p>
      </div>
    </div>
  );
};

export default AttendanceOver;
