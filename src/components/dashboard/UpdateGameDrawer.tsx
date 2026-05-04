// 'use client';

// import { X, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Game, gameAPI } from '@/lib/api/games';
// import { categoryAPI } from '@/lib/api/categories';
// import toast from 'react-hot-toast';

// interface UpdateGameDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   game?: Game;
// }

// const generateSlug = (title: string) => {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-');
// };

// export default function UpdateGameDrawer({ isOpen, onClose, game }: UpdateGameDrawerProps) {
//   const queryClient = useQueryClient();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     slug: '',
//     categoryId: 0,
//     genre: '',
//     rating: 4.5,
//     isActive: true,
//     gameUrl: '',
//     thumbnail: '',
//     description: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Fetch categories dynamically
//   const { data: categories = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ['categories'],
//     queryFn: categoryAPI.getAllCategories,
//   });

//   // Update mutation
//   const updateMutation = useMutation({
//     mutationFn: (data: typeof formData) => {
//       if (!game?.id) throw new Error('Game ID is required');
//       return gameAPI.updateGame(game.id, {
//         title: data.title,
//         categoryId: data.categoryId,
//         genre: data.genre,
//         rating: data.rating,
//         gameUrl: data.gameUrl,
//         thumbnail: data.thumbnail,
//         description: data.description,
//         isActive: data.isActive,
//       });
//     },
//     onSuccess: () => {
//       toast.success('Game updated successfully!');
//       queryClient.invalidateQueries({ queryKey: ['games'] });
//       onClose();
//     },
//     onError: (error: any) => {
//       toast.error(error?.response?.data?.message || 'Failed to update game');
//     },
//   });

//   // Initialize form data when game changes
//   useEffect(() => {
//     if (game) {
//       console.log('Game URL from API:', game.gameUrl);
//       console.log('Game URL length:', game.gameUrl?.length);
      
//       // Auto-fix incomplete iframe HTML
//       let gameUrl = game.gameUrl || '';
//       if (gameUrl.startsWith('<iframe') && !gameUrl.includes('</iframe>') && !gameUrl.endsWith('/>')) {
//         console.warn('Incomplete iframe detected, auto-fixing...');
//         gameUrl = gameUrl + '</iframe>';
//       }
      
//       setFormData({
//         title: game.title || '',
//         slug: generateSlug(game.title || ''),
//         categoryId: game.categoryId || 0,
//         genre: game.genre || '',
//         rating: game.rating || 4.5,
//         isActive: game.isActive ?? true,
//         gameUrl: gameUrl,
//         thumbnail: game.thumbnail || '',
//         description: game.description || '',
//       });
//       setErrors({});
//     }
//   }, [game]);

//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const title = e.target.value;
//     const slug = generateSlug(title);
//     setFormData({ ...formData, title, slug });
//     if (errors.title) setErrors({ ...errors, title: '' });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: name === 'categoryId' || name === 'rating' ? Number(value) : value });
//     if (errors[name]) setErrors({ ...errors, [name]: '' });
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     }

//     if (!formData.categoryId || formData.categoryId === 0) {
//       newErrors.categoryId = 'Category is required';
//     }

//     if (!formData.gameUrl.trim()) {
//       newErrors.gameUrl = 'Game URL is required';
//     } else {
//       // Clean and check if it's an iframe HTML or direct URL
//       const cleanedUrl = formData.gameUrl.trim();
//       const isIframe = cleanedUrl.startsWith('<iframe');
//       const isDirectUrl = cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://');
      
//       if (!isIframe && !isDirectUrl) {
//         newErrors.gameUrl = 'Game URL must be a direct URL (http:// or https://) or iframe HTML';
//       }
      
//       // If it's an iframe, validate completeness and src attribute
//       if (isIframe) {
//         // Check if iframe is complete
//         if (!cleanedUrl.includes('</iframe>') && !cleanedUrl.endsWith('/>')) {
//           newErrors.gameUrl = 'Incomplete iframe HTML - please paste the complete iframe code';
//         } else {
//           const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/i;
//           const match = cleanedUrl.match(iframeRegex);
//           if (!match || !match[1]) {
//             newErrors.gameUrl = 'Invalid iframe HTML - missing src attribute';
//           } else if (match[1].includes('syncframe')) {
//             newErrors.gameUrl = 'This appears to be a tracking iframe, not a game. Please use the actual game embed URL.';
//           }
//         }
//       }
//     }

//     if (!formData.thumbnail.trim()) {
//       newErrors.thumbnail = 'Thumbnail is required';
//     }

//     if (formData.rating < 0 || formData.rating > 5) {
//       newErrors.rating = 'Rating must be between 0 and 5';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the errors in the form');
//       return;
//     }

//     updateMutation.mutate(formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-40">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/50 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Drawer */}
//       <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-slate-700">
//           <h2 className="text-xl font-bold text-white">Update Game</h2>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-slate-400" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Game Title *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={handleTitleChange}
//               className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
//                 errors.title ? 'border-red-500' : 'border-slate-600'
//               }`}
//               placeholder="Enter game title"
//             />
//             {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Slug (Auto-generated)
//             </label>
//             <input
//               type="text"
//               value={formData.slug}
//               readOnly
//               className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400 placeholder-slate-500 focus:outline-none cursor-not-allowed"
//               placeholder="auto-generated from title"
//             />
//             <p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Category *
//             </label>
//             <select
//               name="categoryId"
//               value={formData.categoryId}
//               onChange={handleInputChange}
//               disabled={categoriesLoading}
//               className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
//                 errors.categoryId ? 'border-red-500' : 'border-slate-600'
//               }`}
//             >
//               <option value={0}>Select category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//             {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Genre
//             </label>
//             <input
//               type="text"
//               name="genre"
//               value={formData.genre}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
//               placeholder="e.g., Action, Adventure, Puzzle"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Rating (0-5)
//             </label>
//             <input
//               type="number"
//               name="rating"
//               value={formData.rating}
//               onChange={handleInputChange}
//               min="0"
//               max="5"
//               step="0.1"
//               className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
//                 errors.rating ? 'border-red-500' : 'border-slate-600'
//               }`}
//               placeholder="4.5"
//             />
//             {errors.rating && <p className="text-xs text-red-400 mt-1">{errors.rating}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Game URL *
//             </label>
//             <textarea
//               name="gameUrl"
//               value={formData.gameUrl}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-xs ${
//                 errors.gameUrl ? 'border-red-500' : 'border-slate-600'
//               }`}
//               placeholder="Direct URL: https://example.com/game&#10;OR&#10;Iframe: <iframe src='https://example.com/game'></iframe>"
//             />
//             {errors.gameUrl && <p className="text-xs text-red-400 mt-1">{errors.gameUrl}</p>}
//             <p className="text-xs text-slate-500 mt-1">
//               Accepts direct URL or full iframe HTML code
//             </p>
//             {formData.gameUrl && formData.gameUrl.includes('syncframe') && (
//               <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
//                 ⚠️ Warning: This looks like a tracking iframe, not a game URL
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Thumbnail Image *
//             </label>
//             <input
//               type="text"
//               name="thumbnail"
//               value={formData.thumbnail}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
//                 errors.thumbnail ? 'border-red-500' : 'border-slate-600'
//               }`}
//               placeholder="https://example.com/image.jpg"
//             />
//             {errors.thumbnail && <p className="text-xs text-red-400 mt-1">{errors.thumbnail}</p>}
//             {formData.thumbnail && (
//               <div className="mt-2">
//                 <img 
//                   src={formData.thumbnail} 
//                   alt="Preview" 
//                   className="w-full h-32 object-cover rounded-lg"
//                   onError={(e) => {
//                     e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
//                   }}
//                 />
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
//               placeholder="Enter game description"
//               rows={3}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-300 mb-2">
//               Status
//             </label>
//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
//                 className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
//                   formData.isActive ? 'bg-green-600' : 'bg-slate-600'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
//                     formData.isActive ? 'translate-x-7' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//               <span className="text-sm font-semibold text-slate-300">
//                 {formData.isActive ? 'Active' : 'Inactive'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={updateMutation.isPending}
//             className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             disabled={updateMutation.isPending}
//             className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-600/30 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {updateMutation.isPending ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Updating...
//               </>
//             ) : (
//               'Update Game'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Game, gameAPI } from '@/lib/api/games';
import { categoryAPI } from '@/lib/api/categories';
import toast from 'react-hot-toast';

interface UpdateGameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function UpdateGameDrawer({ isOpen, onClose, game }: UpdateGameDrawerProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    categoryId: 0,
    gameUrl: '',
    thumbnail: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryAPI.getAllCategories,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (!game?.id) throw new Error('Game ID is required');
      return gameAPI.updateGame(game.id, {
        title: data.title,
        categoryId: data.categoryId,
        gameUrl: data.gameUrl,
        thumbnail: data.thumbnail,
        description: data.description,
      });
    },
    onSuccess: () => {
      toast.success('Game updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['games'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update game');
    },
  });

  // Initialize form
  useEffect(() => {
    if (game) {
      let gameUrl = game.gameUrl || '';

      if (
        gameUrl.startsWith('<iframe') &&
        !gameUrl.includes('</iframe>') &&
        !gameUrl.endsWith('/>')
      ) {
        gameUrl += '</iframe>';
      }

      setFormData({
        title: game.title || '',
        slug: generateSlug(game.title || ''),
        categoryId: game.categoryId || 0,
        gameUrl,
        thumbnail: game.thumbnail || '',
        description: game.description || '',
      });

      setErrors({});
    }
  }, [game]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });

    if (errors.title) setErrors({ ...errors, title: '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'categoryId' ? Number(value) : value,
    });

    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.gameUrl.trim()) {
      newErrors.gameUrl = 'Game URL is required';
    } else {
      const cleaned = formData.gameUrl.trim();
      const isIframe = cleaned.startsWith('<iframe');
      const isUrl = cleaned.startsWith('http://') || cleaned.startsWith('https://');

      if (!isIframe && !isUrl) {
        newErrors.gameUrl = 'Must be valid URL or iframe';
      }

      if (isIframe) {
        if (!cleaned.includes('</iframe>') && !cleaned.endsWith('/>')) {
          newErrors.gameUrl = 'Incomplete iframe';
        } else {
          const match = cleaned.match(/src=["']([^"']+)["']/);
          if (!match) newErrors.gameUrl = 'Invalid iframe src';
          else if (match[1].includes('syncframe')) {
            newErrors.gameUrl = 'Tracking iframe not allowed';
          }
        }
      }
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Game</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
                errors.title ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Enter game title"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Slug (Auto-generated)
            </label>
            <input
              type="text"
              value={formData.slug}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Category *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              disabled={categoriesLoading}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
                errors.categoryId ? 'border-red-500' : 'border-slate-600'
              }`}
            >
              <option value={0}>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Game URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Game URL *
            </label>
            <textarea
              name="gameUrl"
              value={formData.gameUrl}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-xs ${
                errors.gameUrl ? 'border-red-500' : 'border-slate-600'
              }`}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Thumbnail *
            </label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
                errors.thumbnail ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Game'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}