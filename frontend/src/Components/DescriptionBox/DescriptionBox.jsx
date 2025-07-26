import React from 'react'
import './DescriptionBox.css'
export const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">
                Description
            </div>
               <div className="descriptionbox-nav-box fade">
                Reviews (122)
            </div>

        </div>
        <div className="descriptionbox-description">
            <p>
                Our e-commerce website is a modern, user-friendly platform designed to provide a seamless online shopping experience. It features a clean and responsive design, enabling customers to browse, search, and purchase products across various categories with ease. The website includes core functionalities such as product listings, product detail pages, shopping cart, secure checkout, user authentication, and order tracking. It also integrates with a payment gateway for smooth transactions and supports admin-side product management for inventory control. Whether on desktop or mobile, the website ensures convenience, reliability, and a pleasant shopping experience for every customer.
            </p>
            <p>
                An e-commerce website typically displays product categories, featured items, and promotional banners on the homepage.
                It includes detailed product pages with images, prices, descriptions, and customer reviews.
                Users can search, filter, add items to a cart, and securely checkout through the platform.
                </p>
        </div>
    </div>
  )
}
