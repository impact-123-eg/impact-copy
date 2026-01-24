import React from 'react'
import { useTranslation } from 'react-i18next';

function Instructor(props) {
    const { t, i18n } = useTranslation();

    return (
        <article className="flex flex-col items-start relative">
            <img src={props.pic} className="w-32 h-32 relative translate-y-5 rounded-full border-4 border-[var(--Light)] object-cover ms-1 -mb-7" />

            <div className="bg-[var(--Light)] space-y-8 my-1 rounded-3xl p-8 px-12">
                <h3 className={`font-bold ${i18n.language == 'en' ? 'text-xl' : 'text-4xl'} text-[var(--LightTxt)] pt-8`}>{props.name}</h3>
                <p className="text-lg text-[var(--LightTxt)] pb-8">{props.years} {t('exp')}</p>
            </div>
        </article>
    )
}

export default Instructor
