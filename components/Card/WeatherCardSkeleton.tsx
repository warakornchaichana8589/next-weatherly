export default function WeatherCardSkeleton() {
     return (
    <div className="flex flex-col gap-6 md:items-center aspect-square rounded-3xl border border-white/50 bg-linear-to-br from-sky-100/90 via-white/80 to-emerald-100/80 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 animate-pulse">
      
     
      <div className="flex flex-1 items-center gap-4 w-full">
        <div className="rounded-2xl bg-white/60 dark:bg-slate-800/70 p-6 w-16 h-16" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-2/3 rounded-full bg-white/60 dark:bg-slate-700" />
          <div className="h-6 w-1/2 rounded-full bg-white/70 dark:bg-slate-600" />
          <div className="h-3 w-3/4 rounded-full bg-white/60 dark:bg-slate-700" />
        </div>
      </div>

      
      <div className="grid
                            grid-cols-1
                            md:grid-cols-2
                            lg:grid-cols-3
                            2xl:grid-cols-4
                            gap-6
                            w-full
                            ">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-2xl bg-white/50 dark:bg-slate-800/70"
          />
        ))}
      </div>
    </div>
  );
};
