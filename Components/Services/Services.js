"use client";
import styles from './Services.module.css';
import { useRouter } from "next/navigation";
import { useSpring, animated } from 'react-spring';

function ServiceBox({ icon, Title, Count, Color, FontColor, FontColorNumber, Navigation }) {
    const router = useRouter();
    const props = useSpring({ number: Count, from: { number: 0 }, config: { duration: 1000 } });
    const handleClick = (e) => {
        e.preventDefault();
        if (Navigation) {
            router.push(Navigation);
        }
    }
    const dynamicStyles = {
        container: {

            background: Color
        },
        title: {
            color: FontColor,
            fontSize: '20px'
        },
        count: {
            fontSize: '30px',
            flex: 'auto',
            fontweight: '800',
            paddingLeft: '5px'
        },
        percentage: {
            color: 'green',
            fontSize: '16px',
            paddingLeft: '10px',
            paddingRight: '10px',
            fontweight: 600,
            borderRadius: '5px',
            background: '#e8f4f1',

        }
    };

    return (
        <div className={`rounded-box ${styles.serviceBoxContainer}`} style={dynamicStyles.container} onClick={handleClick}>
            <div className={`row ${styles.iconRow} px-5 py-3`}>
                <i className={`${icon}`} style={{ color: FontColorNumber }} />
                <span className='px-2' style={dynamicStyles.title}>{Title}</span>
            </div>
            <div className={` ${styles.titleRow}  pt-2`}>
            </div>
            <div className={`row ${styles.countRow} px-5 pt-1 pb-2 flex`} style={{ alignItems: 'center' }}>
                <span style={dynamicStyles.count}><animated.span>
                    {props.number.to(n => n.toFixed(0))}
                </animated.span></span>
                <span style={dynamicStyles.percentage}><i className="fa-solid fa-chart-line mx-1"></i>100%</span>
            </div>
        </div>
    );
}

export default ServiceBox;

