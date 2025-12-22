
import bannerImage from '../../assets/Image.png' 
import BusSearchWidget from './BusSearchWidget'

export default function BannerA() {
    return (
        <div className="relative w-full">
            <div className="w-full">
                <img
                    src={bannerImage}
                    alt="Banner đặt vé xe"
                    className="w-full h-auto object-cover min-h-[400px] max-h-[600px]"
                />
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 z-10">
                <div className="max-w-7xl mx-auto">
                     <BusSearchWidget />
                </div>
            </div>
        </div>
    )
}
