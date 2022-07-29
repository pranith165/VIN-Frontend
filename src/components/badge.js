import Badge from 'react-bootstrap/Badge';
import './badge.css'

const BadgeNumber = ({number}) => {
    return (
        <Badge className='badgeAlignment'>{number}</Badge>
    );
};

export default BadgeNumber;