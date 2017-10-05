const preventingDefault = fn => ev => {
	ev.preventDefault();
	fn(ev);
};

export default preventingDefault;
