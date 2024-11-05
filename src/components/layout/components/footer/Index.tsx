const Footer = () => {
  return (
    <footer className='p-4 text-right'>
      <p>
        2024 - {new Date().getFullYear()} - VenSheets -{' '}
        <a
          href='https://github.com/stevexero'
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
