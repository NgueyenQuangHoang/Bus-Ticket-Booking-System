
import bannerImage from '../../../../assets/Image.png'
import BusSearchWidget from './BusSearchWidget'

import vxIcon from '../../../../assets/icon/vx.png'

export default function BannerA() {
    return (
        <div className="relative w-full">
            <div className="w-full relative">
                <img
                    src={bannerImage}
                    alt="Banner đặt vé xe"
                    className="w-full h-auto object-cover min-h-[400px] max-h-[600px]"
                />
                <img
                    src={vxIcon}
                    alt="Vivu Mascot"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 h-[200px] w-auto md:hidden transition-all duration-300 pointer-events-none"
                />
            </div>

            <div className="relative xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-full px-4 z-10 pb-8 xl:pb-0">
                <div className="max-w-7xl mx-auto">
                    <BusSearchWidget />
                </div>
            </div>
        </div>
    )
}
