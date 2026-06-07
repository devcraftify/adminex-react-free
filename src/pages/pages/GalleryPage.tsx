import { useState } from 'react'
import { SlideshowLightbox } from 'lightbox.js-react'
import { useLocale } from '@/i18n'
import { galleryImages, galleryCategories, type GalleryCategory } from '@/data/gallery'

export default function GalleryPage() {
  const { t } = useLocale()
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all')

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('gallery.title')}</h1>
        <p className="mt-2 text-body-sm text-secondary-600 dark:text-secondary-400">
          {t('gallery.description')}
        </p>
      </div>

      {/* Category Filter */}
      <div className="card rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-theme-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <SlideshowLightbox
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        showThumbnails={true}
        lightboxIdentifier="gallery-lightbox"
      >
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800"
          >
            <img
              src={`${image.src}?w=400&h=400&fit=crop`}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
              data-lightboxjs="gallery-lightbox"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                <p className="text-white/80 text-xs capitalize">{image.category}</p>
              </div>
            </div>
          </div>
        ))}
      </SlideshowLightbox>

      {filteredImages.length === 0 && (
        <div className="card rounded-xl p-12 text-center">
          <p className="text-secondary-500 dark:text-secondary-400">
            {t('gallery.no_images')}
          </p>
        </div>
      )}
    </div>
  )
}
