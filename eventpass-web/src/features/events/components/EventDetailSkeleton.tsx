import Skeleton from "../../../components/skeleton";

export default function EventDetailSkeleton() {
    return (
        <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8 animate-pulse">
            <Skeleton className="w-full lg:w-112.5 h-162.5 rounded-3xl shrink-0" />

            <div className="flex-1 flex flex-col pt-4">
                <Skeleton className="w-24 h-6 mb-8 rounded" />
                <Skeleton className="w-full max-w-2xl h-14 mb-4 rounded-lg" />
                <Skeleton className="w-48 h-8 mb-12 rounded-full" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 mb-12">
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                    <Skeleton className="w-full h-12 rounded-xl" />
                </div>

                <div className="flex flex-col gap-3 mb-12">
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-3/4 h-4 rounded" />
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 flex justify-between items-center">
                    <Skeleton className="w-32 h-10 rounded-lg" />
                    <Skeleton className="w-48 h-14 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
