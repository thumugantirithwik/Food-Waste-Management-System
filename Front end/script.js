// ==========================================
// FOOD WASTE MANAGEMENT SYSTEM
// FRONTEND JAVASCRIPT
// ==========================================


// Backend URL

const API_URL = "http://localhost:5000/api";


// ==========================================
// NOTIFICATION
// ==========================================

function showNotification(message) {

    const notification =
        document.getElementById("notification");

    notification.innerText = message;

    notification.style.display = "block";


    setTimeout(() => {

        notification.style.display = "none";

    }, 3000);

}


// ==========================================
// DONATION FORM
// ==========================================

const donationForm =
    document.getElementById("donationForm");


if (donationForm) {

    donationForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const donation = {

                donorName:
                    document.getElementById(
                        "donorName"
                    ).value,

                phone:
                    document.getElementById(
                        "donorPhone"
                    ).value,

                foodType:
                    document.getElementById(
                        "foodType"
                    ).value,

                quantity:
                    Number(
                        document.getElementById(
                            "quantity"
                        ).value
                    ),

                pickupLocation:
                    document.getElementById(
                        "pickupLocation"
                    ).value,

                pickupDate:
                    document.getElementById(
                        "pickupDate"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/donations`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    donation
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Donation failed"
                    );

                }


                showNotification(
                    "Food donation submitted successfully! 🍱"
                );


                donationForm.reset();


                loadDashboard();

            }

            catch (error) {

                console.error(error);

                showNotification(
                    "Server error. Please check the backend."
                );

            }

        }
    );

}


// ==========================================
// FOOD REQUEST FORM
// ==========================================

const requestForm =
    document.getElementById("requestForm");


if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const request = {

                requesterName:
                    document.getElementById(
                        "requesterName"
                    ).value,

                phone:
                    document.getElementById(
                        "requesterPhone"
                    ).value,

                requiredFood:
                    document.getElementById(
                        "requiredFood"
                    ).value,

                requiredMeals:
                    Number(
                        document.getElementById(
                            "requiredMeals"
                        ).value
                    ),

                deliveryLocation:
                    document.getElementById(
                        "deliveryLocation"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/requests`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    request
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Request failed"
                    );

                }


                showNotification(
                    "Food request submitted successfully! 🤝"
                );


                requestForm.reset();


                loadDashboard();

            }

            catch (error) {

                console.error(error);

                showNotification(
                    "Server error. Please check the backend."
                );

            }

        }
    );

}


// ==========================================
// WASTE REPORT FORM
// ==========================================

const wasteForm =
    document.getElementById("wasteForm");


if (wasteForm) {

    wasteForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const report = {

                name:
                    document.getElementById(
                        "wasteName"
                    ).value,

                wasteType:
                    document.getElementById(
                        "wasteType"
                    ).value,

                quantity:
                    Number(
                        document.getElementById(
                            "wasteQuantity"
                        ).value
                    ),

                location:
                    document.getElementById(
                        "wasteLocation"
                    ).value,

                description:
                    document.getElementById(
                        "wasteDescription"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/waste`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    report
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Report failed"
                    );

                }


                showNotification(
                    "Waste report submitted successfully! ♻️"
                );


                wasteForm.reset();


                loadDashboard();

            }

            catch (error) {

                console.error(error);

                showNotification(
                    "Server error. Please check the backend."
                );

            }

        }
    );

}


// ==========================================
// LOAD DONATIONS
// ==========================================

async function loadDonations() {

    try {

        const response =
            await fetch(
                `${API_URL}/donations`
            );


        const donations =
            await response.json();


        displayDonations(donations);


        return donations;

    }

    catch (error) {

        console.error(
            "Error loading donations:",
            error
        );

        return [];

    }

}


// ==========================================
// DISPLAY DONATIONS
// ==========================================

function displayDonations(donations) {

    const list =
        document.getElementById(
            "donationList"
        );


    if (!list) return;


    if (
        !donations ||
        donations.length === 0
    ) {

        list.innerHTML =
            `<p class="empty">
                No donations submitted yet.
            </p>`;

        return;

    }


    list.innerHTML = "";


    donations
        .slice(0, 10)
        .forEach(donation => {

            const item =
                document.createElement("div");


            item.className =
                "donation-item";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(
                        donation.foodType
                    )}
                </strong>

                <p>
                    Donor:
                    ${escapeHTML(
                        donation.donorName
                    )}
                </p>

                <p>
                    Quantity:
                    ${donation.quantity}
                    meals
                </p>

                <p>
                    Location:
                    ${escapeHTML(
                        donation.pickupLocation
                    )}
                </p>

                <p>
                    Pickup Date:
                    ${escapeHTML(
                        donation.pickupDate
                    )}
                </p>

                <p>
                    Status:
                    <strong>
                        ${escapeHTML(
                            donation.status
                        )}
                    </strong>
                </p>

            `;


            list.appendChild(item);

        });

}


// ==========================================
// LOAD REQUESTS
// ==========================================

async function loadRequests() {

    try {

        const response =
            await fetch(
                `${API_URL}/requests`
            );


        return await response.json();

    }

    catch (error) {

        console.error(error);

        return [];

    }

}


// ==========================================
// LOAD WASTE REPORTS
// ==========================================

async function loadWasteReports() {

    try {

        const response =
            await fetch(
                `${API_URL}/waste`
            );


        return await response.json();

    }

    catch (error) {

        console.error(error);

        return [];

    }

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const [
            donations,
            requests,
            wasteReports
        ] = await Promise.all([

            loadDonations(),

            loadRequests(),

            loadWasteReports()

        ]);


        // Total meals

        let totalMeals = 0;


        donations.forEach(donation => {

            totalMeals +=
                Number(
                    donation.quantity
                ) || 0;

        });


        // Home statistics

        const foodSaved =
            document.getElementById(
                "foodSaved"
            );


        const donationCount =
            document.getElementById(
                "donations"
            );


        const peopleHelped =
            document.getElementById(
                "peopleHelped"
            );


        const wasteReported =
            document.getElementById(
                "wasteReported"
            );


        if (foodSaved)
            foodSaved.innerText =
                totalMeals;


        if (donationCount)
            donationCount.innerText =
                donations.length;


        if (peopleHelped)
            peopleHelped.innerText =
                requests.length;


        if (wasteReported)
            wasteReported.innerText =
                wasteReports.length;


        // Dashboard statistics

        const dashDonations =
            document.getElementById(
                "dashDonations"
            );


        const dashMeals =
            document.getElementById(
                "dashMeals"
            );


        const dashWaste =
            document.getElementById(
                "dashWaste"
            );


        const dashPickups =
            document.getElementById(
                "dashPickups"
            );


        if (dashDonations)
            dashDonations.innerText =
                donations.length;


        if (dashMeals)
            dashMeals.innerText =
                totalMeals;


        if (dashWaste)
            dashWaste.innerText =
                wasteReports.length;


        if (dashPickups)
            dashPickups.innerText =
                donations.filter(
                    d =>
                        d.status ===
                        "Picked Up"
                ).length;

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


// ==========================================
// LOGIN
// ==========================================

function openLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value;


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email,

                                    password

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed"
                    );

                }


                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                showNotification(
                    "Login successful! Welcome 👋"
                );


                closeLogin();


                loginForm.reset();

            }

            catch (error) {

                console.error(error);

                showNotification(
                    error.message
                );

            }

        }
    );

}


// ==========================================
// CLOSE MODAL
// ==========================================

window.onclick =
    function(event) {

        const modal =
            document.getElementById(
                "loginModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeLogin();

        }

    };


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === undefined ||
        value === null) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

    }
);