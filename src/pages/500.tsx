import React from 'react';
import {HomeIcon} from "@heroicons/react/24/outline";

const ServerError = () =>
    <div className="flex flex-col gap-6 items-center justify-center h-screen bg-white">
        <div className="text-6xl font-bold text-primary underline decoration-secondary decoration-4">500</div>
        <div className="text-center">
            <p>Oops ! Une erreur s'est produite sur le serveur.</p>
            <p>Veuillez contacter le support avec des détails sur ce que vous étiez en train de faire lorsque cette erreur est apparue.</p>
        </div>
        <div>
            <a
                href='/dashboard'
                className='flex items-center gap-2.5 border rounded-lg px-3 py-2 hover:bg-gray-50 transition duration-200'
            >
                <HomeIcon className='w-5 h-5'/> Accueil
            </a>
        </div>
    </div>;

export default ServerError;
