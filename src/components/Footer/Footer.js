import React from 'react';

function Footer() {
    return (
        <div>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-400"/>
            <div
                className="p-2.5 flex flex-col items-center justify-center text-center text-sm text-black dark:text-black">
                <p>
                    Исходный код доступен на&nbsp;
                    <a
                        href="https://github.com/sapog87/tlas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        GitHub
                    </a>.
                </p>
            </div>
        </div>
    );
}

export default Footer;
