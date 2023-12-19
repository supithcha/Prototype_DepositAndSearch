
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let data = {
        "username": username,
        "password": password
    };

    fetch("http://localhost:3000/db_login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == "success") {
                localStorage.setItem("token", data.token);
                window.location.href = "/welcome";
            } else {
                // alert("Invalid username or password");
                let invalid_login = document.getElementById("invalid_login");
                invalid_login.innerHTML = `
            <div class="invalidlogin" >
                Invalid username or password
            </div>
        `;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function authen() {
	const token = localStorage.getItem('token');
	fetch('http://localhost:3000/db_authen', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
	})
		.then(response => response.json())
		.then(data_authen => {
			if (data_authen.message == 'Token is valid') {
				//pass
			} else {
				localStorage.removeItem('token');
				alert('Please login first!')
				window.location.href = '/login';
			}
			console.log('Success:', data_authen);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

function search() {
	let data = {
		"destation": "",
		"terstation": "",
		"datesearch": ""
	};

	fetch("http://localhost:3000/gettickets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(res => {
			console.log(res.data);
			let destation = document.getElementById("destation").value;
			let terstation = document.getElementById("terstation").value;
			let datesearch = document.getElementById("datesearch").value;

			let search_result = document.getElementById("search_result");
			search_result.innerHTML = `
			<article  class="headforsearchresult" >
				<h3> Search result</h3>
			</article>
		`
			let data_result = "";
			let count = 0;
			for (let i = res.data.length - 1; i >= 0; i--) {
				if (destation != "" && res.data[i].ORI_STATION != destation) {
					continue;
				}
				if (terstation != "" && res.data[i].DEST_STATION != terstation) {
					continue;
				}
				if (datesearch != "" && res.data[i].DEPART_DATE != datesearch) {
					continue;
				}
				count++;
				data_result += `
				<article class="column">
					<h4> Train ID: ${res.data[i].TRAIN_ID}</h4>
					<section class="dummy_box">
					<p> Train Name: ${res.data[i].TRAIN_NAME} </p>
					<p> Departure Date: ${res.data[i].DEPART_DATE} </p>
					<p> Departure Time: ${res.data[i].DEPART_TIME} </p>
					<p> Arrive Time: ${res.data[i].ARRIVE_TIME} </p>
					<p> Origin Station: ${res.data[i].ORI_STATION} </p>
					<p> Destination Station: ${res.data[i].DEST_STATION} </p>
					</section>
				</article>
			`
			}
			if (count == 0) {
				data_result = `
				<article class="noresult" >
					<h4> No result </h4>
				</article>
			`
			}
			search_result.innerHTML += data_result;

		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

//Deposit
function deposit() {
	let amountmoney = parseFloat(document.getElementById("amountmoney").value);
	// let paymentMethod = document.getElementById("methods").value;

	if (amountmoney > 1000000) {
		console.log("Amount exceeds the limit");
		let search_result = document.getElementById("deposit_result");
		search_result.innerHTML = `
            <article class="headforsearchresult">
                <h1>Deposit result</h1>
            </article>
            <article class="column">
                <section class="dummy_text">                    
                    <h4 style="color: red;" >${'Cannot deposit more than 1,000,000 Baht'}</h4>
                </section>
            </article>
        `;
		return;
	}

	let data = {
		"amountmoney": amountmoney
	};

	fetch("http://localhost:3000/deposit", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + localStorage.getItem("token")
		},
		body: JSON.stringify(data)
	})
		.then(response => response.json())
		.then(res => {
			if (res.message === "Total balance exceeds 1,000,000 Baht") {
				console.log(res.data);
				let search_result = document.getElementById("deposit_result");
				search_result.innerHTML = `
            <article class="headforsearchresult">
                <h1>Deposit result</h1>
            </article>
        `;
				let data_result = "";
				let count = 0;

				for (let i = res.data.length - 1; i >= 0; i--) {
					count++;
					data_result += `
                <article class="column">
                    <section class="dummy_text"> 
							<h4 style="color: red;"> Wallet Balance Exceed 1,000,000 Baht </h4>
							<h4 style="color: red;"> Unable to deposit </h4>
							<br><br>
							<section class="des-info">                
							User ID: ${res.data[i].USER_ID} <br>
							Wallet ID: ${res.data[i].WALLET_ID} <br>
                            Total reward balance: ${res.data[i].TOTOAL_REWARD_BALANCE} <br>
							Total Wallet balance: ${res.data[i].TOTAL_WALLET_BALANCE} <br>
							</section>
                    </section>	
                </article>
            `;
				}

				if (count === 0) {
					data_result = `
                <article class="column">
                    <h4>No result</h4>
                </article>
            `;
				}

				search_result.innerHTML += data_result;
			}
			else {
				console.log(res.data);
				let search_result = document.getElementById("deposit_result");
				search_result.innerHTML = `
            <article class="headforsearchresult">
                <h1>Deposit result</h1>
            </article>
        `;

				let data_result = "";
				let count = 0;

				for (let i = res.data.length - 1; i >= 0; i--) {
					count++;
					data_result += `
                <article class="column">
                    <section class="dummy_text">
						<section class="des-info2">                     
							User ID: ${res.data[i].USER_ID} <br>
							Wallet ID: ${res.data[i].WALLET_ID} <br>
							Deposit amount: ${res.data[i].amountmoney} <br> 
                            Total reward balance: ${res.data[i].TOTOAL_REWARD_BALANCE} <br>
							Total Wallet balance: ${res.data[i].TOTAL_WALLET_BALANCE} <br>
						</section>
					</section>	
                </article>
            `;
				}

				if (count === 0) {
					data_result = `
                <article class="column">
                    <h4>No result</h4>
                </article>
            `;
				}

				search_result.innerHTML += data_result;
			}

		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

const outputHtml = document.getElementById("creditcardnum");

function getCard() {
	if (document.getElementById('methods').value === "Credit card") {
		console.log("calling get web service");
		fetch("http://localhost:3000/userinfo", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
		})
			.then(response => response.json())
			.then(res => {
				console.log(res.data);
				if (res.data.length > 0) {
					outputHtml.innerHTML = "<article class='rcorners'>" + res.data[0].USER_CREDITCARDNUM + "</article>";
				} else {
					outputHtml.innerHTML = "No credit card information found.";
				}
			})
	}
}

// async function showWallet() {
//     try {
//         console.log("calling update web service");
// 		fetch("http://localhost:3000/walletinfo", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + localStorage.getItem("token")
//         },
//         body: JSON.stringify(data)
//     })
//         // alert("Money deposit successfully");
//     } catch (error) {
//         console.error("Error during deposit:", error);
//         alert("Error during deposit. Please try again.");
//     }
// }











