const Footer = () => {
  return (
    <footer className='p-4 text-center md:text-right'>
      <p>
        2024 - {new Date().getFullYear()} - VenSheets -{' '}
        <a
          href='https://github.com/stevexero/vensheets'
          target='_blank'
          className='underline'
        >
          Open Source
        </a>
      </p>
    </footer>
  );
};

export default Footer;
