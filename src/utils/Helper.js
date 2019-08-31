// import * as moment from 'moment/moment';
import moment from 'moment';

const today = new Date();
// const hourago = new Date(today.getTime() - (1000*60*60));
export const timeNowLocal = moment(today).local().format('YYYY-MM-DD HH:mm:ss');

export const toDateLocal  = (date) => {
    return moment(date).local().format('YYYY-MM-DD')
} 

export const toDateTimeLocal  = (date) => {
    return moment(date).local().format('DD-MM-YYYY HH:mm:ss')
}

export const toDateTimeLocalDB  = (date) => {
    return moment(date).local().format('YYYY-MM-DD HH:mm:ss')
} 

export const lastMomentAgo = (minutes) => {
  const timeAgoInMinutes = new Date(today.getTime() - (1000*60*minutes));
  const formatTime = moment(timeAgoInMinutes).local().format('YYYY-MM-DD HH:mm:ss');
  return formatTime
}


export const toRomawiString = (value) => {
	const toArrayValue = value.split('')
	const joinArrayValue = toArrayValue.join('.')
	return joinArrayValue
} 


