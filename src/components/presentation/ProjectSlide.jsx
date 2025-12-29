export function ProjectSlide({ slideUrl, projectName }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <img
        src={slideUrl}
        alt={projectName || 'Project slide'}
        className="max-w-full max-h-full object-contain"
        loading="lazy"
      />
    </div>
  )
}

