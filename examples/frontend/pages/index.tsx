import React from 'react';
import Link from 'next/link';

export function Index() {
    /*
     * Replace the elements below with your own.
     *
     * Note: The corresponding styles are in the ./index.styled-jsx file.
     */
    return (
        <div>
            <style jsx>{`
                .page {
                }
            `}</style>

            <Link href="/page1">Page 1</Link>
        </div>
    );
}

export default Index;
