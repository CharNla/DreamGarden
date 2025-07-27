import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = "md", 
  readonly = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const handleClick = (starRating: number) => {
    if (!readonly) {
      onRatingChange(starRating);
    }
  };

  const handleHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <motion.button
          key={starNumber}
          type="button"
          className={`${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-200`}
          onClick={() => handleClick(starNumber)}
          onMouseEnter={() => handleHover(starNumber)}
          onMouseLeave={handleLeave}
          whileHover={readonly ? {} : { scale: 1.1 }}
          whileTap={readonly ? {} : { scale: 0.95 }}
        >
          <Star
            className={`w-full h-full ${
              starNumber <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}
