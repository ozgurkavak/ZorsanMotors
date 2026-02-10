"use client";

import Script from "next/script";

export function CarfaxRatings() {
    return (
        <div className="w-full flex justify-center py-8 bg-white dark:bg-background">
            <div className="relative" style={{ minHeight: '320px' }}>
                {/* CARFAX Widget Container */}
                <div
                    {...{ "data-cfx-widget": "" }}
                    data-compcode="4T28JAHEYW"
                    data-orientation="horizontal"
                    // @ts-ignore
                    version="2"
                    style={{
                        backgroundColor: '#ffffff',
                        width: '498px',
                        height: '314px',
                        maxWidth: '100%', // Ensure responsiveness
                        margin: '0 auto',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}
                >
                </div>

                {/* CARFAX Script */}
                <Script
                    id="cfx-script"
                    src="https://ratings.carfax.com/top-rated/v1/js/cfx-loader.js?type=module"
                    strategy="lazyOnload"
                />
            </div>
        </div>
    );
}
