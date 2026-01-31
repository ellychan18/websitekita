import type { Drama } from '@/types'
import DramaCard from './DramaCard'

export default function DramaGrid({ dramas }: { dramas: Drama[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
      {dramas.map((d, index) => (
        <div 
          key={d.bookId || d.series_id} 
          className="animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <DramaCard drama={d} />
        </div>
      ))}
    </div>
  )
}