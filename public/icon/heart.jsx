export default function Heart({ className, color }) {
	return (
		<svg
			className={`${className}`}
			viewBox="0 0 25 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M12.4932 5.13581C10.4938 2.7984 7.15975 2.16964 4.65469 4.31001C2.14964 6.45038 1.79697 10.029 3.7642 12.5604C5.39982 14.6651 10.3498 19.1041 11.9721 20.5408C12.1536 20.7016 12.2444 20.7819 12.3502 20.8135C12.4426 20.8411 12.5437 20.8411 12.6361 20.8135C12.7419 20.7819 12.8327 20.7016 13.0142 20.5408C14.6365 19.1041 19.5865 14.6651 21.2221 12.5604C23.1893 10.029 22.8797 6.42787 20.3316 4.31001C17.7835 2.19216 14.4925 2.7984 12.4932 5.13581Z"
				stroke={color}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
}
