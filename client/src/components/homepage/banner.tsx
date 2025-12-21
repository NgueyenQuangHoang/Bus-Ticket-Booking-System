import React from 'react'
import bannerImage from '../../assets/Image.png' // Update the path to match your actual image location

export default function Banner() {
    return (
        <div>
            <section className="w-full">
                <img
                    src={bannerImage}
                    alt="Banner đặt vé xe"
                    className="w-full h-auto object-cover"
                />
            </section>
        </div>
    )
}
