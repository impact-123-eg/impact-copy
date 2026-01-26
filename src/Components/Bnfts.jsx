import { FaCheck } from 'react-icons/fa';
import { useI18n } from '../hooks/useI18n';

function Bnfts(props) {
      const { currentLocale } = useI18n();
      return (
            <article className='border-2 border-[var(--SubTextBorder)] p-4 rounded-3xl flex space-x-4 lg:space-x-8 items-center'>
                  <span className={`p-2 inline-block text-white rounded-full ${currentLocale === 'en' ? "" : "mx-2"}   bg-[var(--Main)]`}>
                        <FaCheck />
                  </span>
                  <p className='text-md lg:text-center lg:text-lg '>{props.text}</p>
            </article>
      )
}

export default Bnfts
