/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		container: {
    			center: true,
    			padding: '15px',
				width: '1440px',  
    		},
    		fontSize: {
    			'10xl': '10rem'
    		},
    		colors: {
    			primary: '#1C1C22',
    			secondary: '#363537',
    			background: '#FFFFFF',
				primary3: '#334155', // Adjust as needed
      			dark3: '#1e293b',
    			backgroundSecondary: '#D1D1D1',
    			blueAccent: {
    				DEFAULT: '#2b2160',
    				hover: '#2A91C1'
    			},
    			accent: {
    				DEFAULT: '#2b2160',
    				hover: '#DB1E05'
    			},
    			yellowAccent: '#FFD400',
    			grayAccent: '#888888',
    			grayLight: '#AAAAAA',
    			darkPrimary: '#FFFFFF',
    			darkSecondary: '#D1D1D1',
    			darkBackground: '#1C1C22',
    			darkBlueAccent: {
    				DEFAULT: '#35B5F4',
    				hover: '#2A91C1'
    			},
    			darkAccent: {
    				DEFAULT: '#FF4129',
    				hover: '#DB1E05'
    			},
    			darkYellowAccent: '#FFD400',
    			darkGrayAccent: '#888888',
    			darkGrayLight: '#AAAAAA'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		screens: {
    			xs: '480px',
    			md: '640px',
    			lg: '960px',
    			xl: '1200px',
    			'3xl': '1920px'
    		},
    		keyframes: {
					slide: {
					  '0%': { transform: 'translateX(-100%)' },
					  '100%': { transform: 'translateX(0)' },
					},
    			fadeIn: {
    				from: {
    					opacity: 0
    				},
    				to: {
    					opacity: 1
    				}
    			},
    			fadeOut: {
    				from: {
    					opacity: 1
    				},
    				to: {
    					opacity: 0
    				}
    			},
    			slideInLeft: {
    				from: {
    					transform: 'translateX(-100%)'
    				},
    				to: {
    					transform: 'translateX(0)'
    				}
    			},
    			slideInRight: {
    				from: {
    					transform: 'translateX(100%)'
    				},
    				to: {
    					transform: 'translateX(0)'
    				}
    			},
    			slideInTop: {
    				from: {
    					transform: 'translateY(-100%)'
    				},
    				to: {
    					transform: 'translateY(0)'
    				}
    			},
    			slideInBottom: {
    				from: {
    					transform: 'translateY(100%)'
    				},
    				to: {
    					transform: 'translateY(0)'
    				}
    			},
    			slideOutLeft: {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(-100%)'
    				}
    			},
    			slideOutRight: {
    				from: {
    					transform: 'translateX(0)'
    				},
    				to: {
    					transform: 'translateX(100%)'
    				}
    			},
    			slideOutTop: {
    				from: {
    					transform: 'translateY(0)'
    				},
    				to: {
    					transform: 'translateY(-100%)'
    				}
    			},
    			slideOutBottom: {
    				from: {
    					transform: 'translateY(0)'
    				},
    				to: {
    					transform: 'translateY(100%)'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			fadeIn: 'fadeIn 0.5s ease-in-out',
    			fadeOut: 'fadeOut 0.5s ease-in-out',
				slide: 'slide 2s ease-out forwards',
    			slideInLeft: 'slideInLeft 0.5s ease-in-out',
    			slideInRight: 'slideInRight 0.5s ease-in-out',
    			slideInTop: 'slideInTop 0.5s ease-in-out',
    			slideInBottom: 'slideInBottom 0.5s ease-in-out',
    			slideOutLeft: 'slideOutLeft 0.5s ease-in-out',
    			slideOutRight: 'slideOutRight 0.5s ease-in-out',
    			slideOutTop: 'slideOutTop 0.5s ease-in-out',
    			slideOutBottom: 'slideOutBottom 0.5s ease-in-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		fontFamily: {
				parisienne: ["Parisienne", "cursive"],
    			primary: [
    				'JetBrains Mono"',
    				'monospace'
    			],
    			secondary: [
    				'Lora',
    				'serif'
    			],
    			body: [
    				'Source Sans 3',
    				'sans-serif'
    			]
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
  };
  