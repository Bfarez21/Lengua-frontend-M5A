
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ResponsiveCarousel = ({ items, renderItem, autoPlaySpeed = 3000 }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1536 },
      items: 3,
      partialVisibilityGutter: 40
    },
    desktop: {
      breakpoint: { max: 1536, min: 1024 },
      items: 3,
      partialVisibilityGutter: 30
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      partialVisibilityGutter: 20
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      partialVisibilityGutter: 10
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .carousel-container {
            padding: 20px 0 40px 0;
          }
          .carousel-item {
            transition: all 0.3s ease;
            transform: scale(0.9);
            opacity: 0.8;
          }
          .carousel-item.active {
            transform: scale(1.1);
            opacity: 1;
            z-index: 1;
          }
          @media (max-width: 640px) {
            .carousel-item.active {
              transform: scale(1);
            }
          }
        `}
      </style>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={autoPlaySpeed}
        keyBoardControl={true}
        customTransition="all 300ms ease-in-out"
        transitionDuration={300}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        centerMode={true}
        itemClass="carousel-item"
        beforeChange={(nextSlide) => {
          // Remover clase active de todos los items
          document.querySelectorAll('.carousel-item').forEach(item => {
            item.classList.remove('active');
          });
          // Añadir clase active al item central
          setTimeout(() => {
            const activeItem = document.querySelector(`.carousel-item:nth-child(${nextSlide + 2})`);
            if (activeItem) {
              activeItem.classList.add('active');
            }
          }, 0);
        }}
      >
        {items.map((item) => renderItem(item))}
      </Carousel>
    </div>
  );
};

export default ResponsiveCarousel;