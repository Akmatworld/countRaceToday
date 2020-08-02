// ==UserScript==
// @name         Cnt race
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://klavogonki.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	function formatDate(date) {
	    let d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	}

	function createElementForCnt(cnt, maxSpeedData) {
		let div       = document.getElementsByClassName("userpanel logged pinned")[0];
		let spanRight = document.createElement("span");
		let p         = document.createElement("p");
		let spanLeft  = document.createElement("span");
		
		let maxSpeed           = document.createElement("p");
		let maxSpeedSpanText   = document.createElement("span");
		let maxSpeedSpanNumber = document.createElement("span");

		p.classList.add("racecnt-p");
		maxSpeed.classList.add("racecnt-p-max-speed");
		maxSpeedSpanNumber.classList.add("racecnt-max-speed-number");
		spanRight.classList.add("racecnt-right");
		spanLeft.classList.add("racecnt-left");

		let textMaxSpeedNumber  = document.createTextNode(maxSpeedData);
		let textMaxSpeedText    = document.createTextNode('Max speed:');
		let textSpanRight       = document.createTextNode(cnt);
		let textSpanLeft        = document.createTextNode('Count race today: ');
		
		spanRight.appendChild(textSpanRight);
		spanLeft.appendChild(textSpanLeft);
		maxSpeedSpanText.appendChild(textMaxSpeedText);
		maxSpeedSpanNumber.appendChild(textMaxSpeedNumber);
		maxSpeed.appendChild(maxSpeedSpanText);
		maxSpeed.appendChild(maxSpeedSpanNumber);
		
		p.appendChild(spanLeft);
		p.appendChild(spanRight);
		p.appendChild(maxSpeed);
		div.appendChild(p);
	}

	function addStylesForCnt() {
	    const css = `.racecnt-p {
	        position: absolute;
	        left: 547px;
	        top: 4px;
	        font-size: 11px;
	    }
		.racecnt-right {
	    	color: #fff;
	    	font-size: 14px;
	    	font-weight: bold;	
	    }
	    .racecnt-p-max-speed {
	    	margin: 0 !important;
	    }
	    .racecnt-max-speed-number {
	    	color: #fff;
	    	font-size: 14px;
	    	font-weight: bold;
	    	padding-left: 4px;
	    }
	    `,
	    head = document.head || document.getElementsByTagName('head')[0],
	    style = document.createElement('style');
	    head.appendChild(style);

	    style.type = 'text/css';
	    if (style.styleSheet){
	        // This is required for IE8 and below.
	        style.styleSheet.cssText = css;
	    } else {
	        style.appendChild(document.createTextNode(css));
	    }
	}

	function getValue(data, prop) {
		return data.list[data.list.length - 1][prop];
	}

	async function sendRequest() {
		let today = new Date();
		let toDate = formatDate(today);
		today.setDate(today.getDate() - 1);
		let fromDate = formatDate(today);

		const url = `http://klavogonki.ru/api/profile/get-stats-details-data?userId=503791&gametype=voc-5539&fromDate=${fromDate}&toDate=${toDate}&grouping=day`;

		// send request to kg
		let req = await fetch(url);
		if (req.ok) {
		  let json = await req.json();
		  createElementForCnt(getValue(json, 'cnt'), getValue(json, 'max_speed'));
		} else {
		  console.log("Ошибка HTTP: " + req.status);
		}
	}

	sendRequest();
	addStylesForCnt();

})();