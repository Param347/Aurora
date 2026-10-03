/* =========================================================
   AURORA ADMIN DASHBOARD
   ========================================================= */

const API_URL =
    "http://localhost:5000/api/vendors";


// =========================================================
// STATE
// =========================================================

let vendors = [];

let currentStatus =
    "all";


// =========================================================
// DOM ELEMENTS
// =========================================================

const navLinks =
    document.querySelectorAll(
        ".admin-nav-link"
    );

const sections =
    document.querySelectorAll(
        ".admin-section"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const totalVendors =
    document.getElementById(
        "totalVendors"
    );

const pendingVendors =
    document.getElementById(
        "pendingVendors"
    );

const approvedVendors =
    document.getElementById(
        "approvedVendors"
    );

const rejectedVendors =
    document.getElementById(
        "rejectedVendors"
    );

const pendingCount =
    document.getElementById(
        "pendingCount"
    );

const recentVendors =
    document.getElementById(
        "recentVendors"
    );

const vendorList =
    document.getElementById(
        "vendorList"
    );

const vendorSearch =
    document.getElementById(
        "vendorSearch"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const refreshButton =
    document.getElementById(
        "refreshButton"
    );

const vendorRefreshButton =
    document.getElementById(
        "vendorRefreshButton"
    );

const vendorModal =
    document.getElementById(
        "vendorModal"
    );

const vendorModalContent =
    document.getElementById(
        "vendorModalContent"
    );

const closeVendorModal =
    document.getElementById(
        "closeVendorModal"
    );


// =========================================================
// NAVIGATION
// =========================================================

navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const sectionName =
                    link.dataset.section;

                openSection(
                    sectionName
                );

            }
        );

    }
);


// =========================================================
// OPEN SECTION
// =========================================================

function openSection(
    sectionName
) {

    navLinks.forEach(
        function (link) {

            link.classList.toggle(
                "active",
                link.dataset.section ===
                sectionName
            );

        }
    );


    sections.forEach(
        function (section) {

            section.classList.remove(
                "active"
            );

        }
    );


    const targetSection =
        document.getElementById(
            `${sectionName}Section`
        );


    if (targetSection) {

        targetSection.classList.add(
            "active"
        );

    }


    const titles = {

        overview:
            "Overview",

        vendors:
            "Vendor Applications",

        users:
            "User Management",

        bookings:
            "Booking Monitoring",

        services:
            "Service Management",

        settings:
            "Admin Settings"

    };


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionName] ||
            "Overview";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (
        sectionName ===
        "vendors"
    ) {

        renderVendors();

    }

}


// =========================================================
// OPEN SECTION BUTTONS
// =========================================================

document
    .querySelectorAll(
        "[data-open-section]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openSection(
                        button.dataset.openSection
                    );

                }
            );

        }
    );


// =========================================================
// LOAD VENDORS
// =========================================================

async function loadVendors() {

    showLoadingState();

    try {

        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch vendors."
            );

        }


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Unable to load vendors."
            );

        }


        vendors =
            Array.isArray(
                result.vendors
            )
                ? result.vendors
                : [];


        updateDashboardStats();

        renderRecentVendors();

        renderVendors();


    } catch (error) {

        console.error(
            "Admin vendor loading error:",
            error
        );


        showVendorError(
            error.message
        );

    }

}


// =========================================================
// LOADING STATE
// =========================================================

function showLoadingState() {

    if (recentVendors) {

        recentVendors.innerHTML = `

            <div class="loading-state">

                <div class="loading-spinner"></div>

                <p>
                    Loading vendor applications...
                </p>

            </div>

        `;

    }


    if (vendorList) {

        vendorList.innerHTML = `

            <div class="loading-state">

                <div class="loading-spinner"></div>

                <p>
                    Loading vendors...
                </p>

            </div>

        `;

    }

}


// =========================================================
// ERROR STATE
// =========================================================

function showVendorError(
    message
) {

    if (recentVendors) {

        recentVendors.innerHTML = `

            <div class="error-state">

                <strong>
                    Unable to load vendors
                </strong>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    }


    if (vendorList) {

        vendorList.innerHTML = `

            <div class="error-state">

                <strong>
                    Unable to load vendors
                </strong>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    }

}


// =========================================================
// UPDATE DASHBOARD STATS
// =========================================================

function updateDashboardStats() {

    const total =
        vendors.length;


    const pending =
        vendors.filter(
            function (vendor) {

                return getVendorStatus(
                    vendor
                ) === "pending";

            }
        ).length;


    const approved =
        vendors.filter(
            function (vendor) {

                return getVendorStatus(
                    vendor
                ) === "approved";

            }
        ).length;


    const rejected =
        vendors.filter(
            function (vendor) {

                return getVendorStatus(
                    vendor
                ) === "rejected";

            }
        ).length;


    if (totalVendors) {

        totalVendors.textContent =
            total;

    }


    if (pendingVendors) {

        pendingVendors.textContent =
            pending;

    }


    if (approvedVendors) {

        approvedVendors.textContent =
            approved;

    }


    if (rejectedVendors) {

        rejectedVendors.textContent =
            rejected;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }

}


// =========================================================
// GET VENDOR STATUS
// =========================================================

function getVendorStatus(
    vendor
) {

    if (
        vendor &&
        typeof vendor.status ===
        "string"
    ) {

        return vendor.status.toLowerCase();

    }


    return "pending";

}


// =========================================================
// GET VENDOR NAME
// =========================================================

function getVendorName(
    vendor
) {

    return (
        vendor.businessName ||
        vendor.name ||
        "Unnamed Vendor"
    );

}


// =========================================================
// GET VENDOR CATEGORY
// =========================================================

function getVendorCategory(
    vendor
) {

    if (
        vendor.services &&
        vendor.services.primary
    ) {

        return formatText(
            vendor.services.primary
        );

    }


    return (
        vendor.category ||
        "Event Service"
    );

}


// =========================================================
// GET VENDOR LOCATION
// =========================================================

function getVendorLocation(
    vendor
) {

    if (
        vendor.location &&
        typeof vendor.location ===
        "object"
    ) {

        const city =
            vendor.location.city ||
            "";

        const state =
            vendor.location.state ||
            "";

        return [
            city,
            state
        ]
            .filter(Boolean)
            .join(", ") ||
            "Location not specified";

    }


    if (
        typeof vendor.location ===
        "string"
    ) {

        return vendor.location;

    }


    return "Location not specified";

}


// =========================================================
// GET VENDOR IMAGE
// =========================================================

function getVendorImage(
    vendor
) {

    if (
        vendor.images &&
        vendor.images.profileImage
    ) {

        return buildImageURL(
            vendor.images.profileImage
        );

    }


    return "";

}


// =========================================================
// BUILD IMAGE URL
// =========================================================

function buildImageURL(
    imagePath
) {

    if (!imagePath) {

        return "";

    }


    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {

        return imagePath;

    }


    return (
        "http://localhost:5000" +
        imagePath
    );

}


// =========================================================
// FORMAT TEXT
// =========================================================

function formatText(
    value
) {

    if (!value) {

        return "";

    }


    return String(value)
        .replace(
            /[-_]/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (character) {
                return character.toUpperCase();
            }
        );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(
    value
) {

    return String(
        value || ""
    )
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


// =========================================================
// RENDER RECENT VENDORS
// =========================================================

function renderRecentVendors() {

    if (
        !recentVendors
    ) {

        return;

    }


    if (
        vendors.length === 0
    ) {

        recentVendors.innerHTML = `

            <div class="loading-state">

                <p>
                    No vendor applications yet.
                </p>

            </div>

        `;

        return;

    }


    const recent =
        vendors.slice(
            0,
            5
        );


    recentVendors.innerHTML =
        recent
            .map(
                function (vendor) {

                    const name =
                        getVendorName(
                            vendor
                        );

                    const category =
                        getVendorCategory(
                            vendor
                        );

                    const status =
                        getVendorStatus(
                            vendor
                        );

                    const image =
                        getVendorImage(
                            vendor
                        );


                    return `

                        <div
                            class="recent-vendor"
                        >

                            <div
                                class="recent-vendor-main"
                            >

                                ${
                                    image
                                        ? `
                                            <img
                                                class="vendor-small-image"
                                                src="${escapeHTML(image)}"
                                                alt="${escapeHTML(name)}"
                                            >
                                          `
                                        : `
                                            <div
                                                class="vendor-small-image vendor-small-placeholder"
                                            >
                                                ${escapeHTML(
                                                    name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>
                                          `
                                }


                                <div>

                                    <h4>
                                        ${escapeHTML(name)}
                                    </h4>

                                    <p>
                                        ${escapeHTML(category)}
                                        ·
                                        ${escapeHTML(
                                            getVendorLocation(
                                                vendor
                                            )
                                        )}
                                    </p>

                                </div>

                            </div>


                            <span
                                class="status-badge status-${escapeHTML(status)}"
                            >
                                ${escapeHTML(status)}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


// =========================================================
// RENDER VENDORS
// =========================================================

function renderVendors() {

    if (
        !vendorList
    ) {

        return;

    }


    const searchTerm =
        vendorSearch
            ? vendorSearch.value
                .trim()
                .toLowerCase()
            : "";


    let filteredVendors =
        vendors.filter(
            function (vendor) {

                const status =
                    getVendorStatus(
                        vendor
                    );


                const matchesStatus =
                    currentStatus ===
                    "all" ||
                    status ===
                    currentStatus;


                const searchableText = [

                    getVendorName(
                        vendor
                    ),

                    getVendorCategory(
                        vendor
                    ),

                    getVendorLocation(
                        vendor
                    ),

                    vendor.ownerName ||
                    "",

                    vendor.contact?.email ||
                    vendor.email ||
                    "",

                    vendor.contact?.phone ||
                    vendor.phone ||
                    ""

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    searchableText.includes(
                        searchTerm
                    );


                return (
                    matchesStatus &&
                    matchesSearch
                );

            }
        );


    if (
        filteredVendors.length === 0
    ) {

        vendorList.innerHTML = `

            <div class="error-state">

                <strong>
                    No vendors found
                </strong>

                <p>
                    Try changing the search or status filter.
                </p>

            </div>

        `;

        return;

    }


    vendorList.innerHTML =
        filteredVendors
            .map(
                function (vendor) {

                    return createVendorRow(
                        vendor
                    );

                }
            )
            .join("");


    attachVendorActions();

}


// =========================================================
// CREATE VENDOR ROW
// =========================================================

function createVendorRow(
    vendor
) {

    const name =
        getVendorName(
            vendor
        );

    const category =
        getVendorCategory(
            vendor
        );

    const location =
        getVendorLocation(
            vendor
        );

    const status =
        getVendorStatus(
            vendor
        );

    const image =
        getVendorImage(
            vendor
        );


    const email =
        vendor.contact?.email ||
        vendor.email ||
        "Not provided";


    const phone =
        vendor.contact?.phone ||
        vendor.phone ||
        "Not provided";


    const startingPrice =
        vendor.pricing?.startingPrice ??
        vendor.startingPrice;


    const priceUnit =
        vendor.pricing?.unit ||
        "";


    let priceText =
        "Not specified";


    if (
        startingPrice !==
        undefined &&
        startingPrice !==
        null &&
        startingPrice !==
        ""
    ) {

        priceText =
            `₹${Number(
                startingPrice
            ).toLocaleString("en-IN")}`;

        if (priceUnit) {

            priceText +=
                ` / ${formatText(
                    priceUnit
                )}`;

        }

    }


    return `

        <article
            class="vendor-row"
        >

            ${
                image
                    ? `
                        <img
                            class="vendor-row-image"
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                        >
                      `
                    : `
                        <div
                            class="vendor-row-image vendor-small-placeholder"
                        >
                            ${escapeHTML(
                                name
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>
                      `
            }


            <div
                class="vendor-row-info"
            >

                <h4>
                    ${escapeHTML(name)}
                </h4>

                <p>
                    ${escapeHTML(
                        email
                    )}
                </p>

            </div>


            <div
                class="vendor-meta"
            >

                <strong>
                    Category
                </strong>

                ${escapeHTML(
                    category
                )}

            </div>


            <div
                class="vendor-meta"
            >

                <strong>
                    Starting Price
                </strong>

                ${escapeHTML(
                    priceText
                )}

            </div>


            <div
                class="vendor-actions"
            >

                <span
                    class="status-badge status-${escapeHTML(status)}"
                >
                    ${escapeHTML(status)}
                </span>


                <button
                    type="button"
                    class="view-vendor-btn"
                    data-vendor-id="${escapeHTML(
                        vendor._id || ""
                    )}"
                >
                    View
                </button>


                ${
                    status ===
                    "pending"
                        ? `
                            <button
                                type="button"
                                class="approve-btn"
                                data-action="approve"
                                data-vendor-id="${escapeHTML(
                                    vendor._id || ""
                                )}"
                            >
                                Approve
                            </button>

                            <button
                                type="button"
                                class="reject-btn"
                                data-action="reject"
                                data-vendor-id="${escapeHTML(
                                    vendor._id || ""
                                )}"
                            >
                                Reject
                            </button>
                          `
                        : ""
                }

            </div>

        </article>

    `;

}


// =========================================================
// ATTACH VENDOR ACTIONS
// =========================================================

function attachVendorActions() {

    document
        .querySelectorAll(
            ".view-vendor-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openVendorModal(
                            button.dataset.vendorId
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        updateVendorStatus(
                            button.dataset.vendorId,
                            "approved"
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".reject-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        updateVendorStatus(
                            button.dataset.vendorId,
                            "rejected"
                        );

                    }
                );

            }
        );

}


// =========================================================
// SEARCH
// =========================================================

if (vendorSearch) {

    vendorSearch.addEventListener(
        "input",
        function () {

            renderVendors();

        }
    );

}


// =========================================================
// STATUS FILTERS
// =========================================================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (filter) {

                        filter.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentStatus =
                    button.dataset.status;


                renderVendors();

            }
        );

    }
);


// =========================================================
// OPEN VENDOR MODAL
// =========================================================

function openVendorModal(
    vendorId
) {

    const vendor =
        vendors.find(
            function (item) {

                return String(
                    item._id
                ) ===
                String(
                    vendorId
                );

            }
        );


    if (!vendor) {

        return;

    }


    const name =
        getVendorName(
            vendor
        );

    const category =
        getVendorCategory(
            vendor
        );

    const location =
        getVendorLocation(
            vendor
        );

    const status =
        getVendorStatus(
            vendor
        );

    const image =
        getVendorImage(
            vendor
        );


    const email =
        vendor.contact?.email ||
        vendor.email ||
        "Not provided";


    const phone =
        vendor.contact?.phone ||
        vendor.phone ||
        "Not provided";


    const website =
        vendor.contact?.website ||
        vendor.website ||
        "Not provided";


    const address =
        vendor.location &&
        typeof vendor.location ===
        "object"
            ? vendor.location.address ||
              "Not provided"
            : "Not provided";


    const experience =
        vendor.experience ??
        "Not provided";


    const eventsHandled =
        vendor.eventsHandled ??
        "Not provided";


    const description =
        vendor.businessDescription ||
        vendor.description ||
        "No description provided.";


    const serviceDescription =
        vendor.services?.description ||
        "";


    const serviceArea =
        vendor.serviceArea ||
        "Not specified";


    const startingPrice =
        vendor.pricing?.startingPrice ??
        vendor.startingPrice;


    const priceUnit =
        vendor.pricing?.unit ||
        "";


    let priceText =
        "Not specified";


    if (
        startingPrice !==
        undefined &&
        startingPrice !==
        null &&
        startingPrice !==
        ""
    ) {

        priceText =
            `₹${Number(
                startingPrice
            ).toLocaleString("en-IN")}`;

        if (priceUnit) {

            priceText +=
                ` / ${formatText(
                    priceUnit
                )}`;

        }

    }


    const portfolio =
        vendor.images?.portfolio ||
        [];


    vendorModalContent.innerHTML = `

        <div
            class="modal-vendor-header"
        >

            ${
                image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            class="modal-profile-image"
                        >
                      `
                    : `
                        <div
                            class="modal-profile-image vendor-small-placeholder"
                        >
                            ${escapeHTML(
                                name
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>
                      `
            }


            <div
                class="modal-vendor-title"
            >

                <span
                    class="status-badge status-${escapeHTML(status)}"
                >
                    ${escapeHTML(status)}
                </span>

                <h2>
                    ${escapeHTML(name)}
                </h2>

                <p>
                    ${escapeHTML(category)}
                    ·
                    ${escapeHTML(location)}
                </p>

            </div>

        </div>



        <h3
            class="modal-section-title"
        >
            Business Information
        </h3>


        <div
            class="modal-details-grid"
        >

            ${createDetailBox(
                "Owner / Contact Person",
                vendor.ownerName ||
                "Not provided"
            )}

            ${createDetailBox(
                "Experience",
                `${experience} years`
            )}

            ${createDetailBox(
                "Email",
                email
            )}

            ${createDetailBox(
                "Phone",
                phone
            )}

            ${createDetailBox(
                "Website",
                website
            )}

            ${createDetailBox(
                "Starting Price",
                priceText
            )}

            ${createDetailBox(
                "Service Area",
                serviceArea
            )}

            ${createDetailBox(
                "Events Handled",
                eventsHandled
            )}

        </div>



        <h3
            class="modal-section-title"
        >
            Business Description
        </h3>


        <div
            class="modal-detail-box"
        >

            <p>
                ${escapeHTML(
                    description
                )}
            </p>

        </div>



        ${
            serviceDescription
                ? `
                    <h3
                        class="modal-section-title"
                    >
                        Service Description
                    </h3>

                    <div
                        class="modal-detail-box"
                    >

                        <p>
                            ${escapeHTML(
                                serviceDescription
                            )}
                        </p>

                    </div>
                  `
                : ""
        }



        <h3
            class="modal-section-title"
        >
            Location
        </h3>


        <div
            class="modal-detail-box"
        >

            <p>
                ${escapeHTML(
                    address
                )}
                <br>
                ${escapeHTML(
                    location
                )}
            </p>

        </div>



        ${
            portfolio.length > 0
                ? `
                    <h3
                        class="modal-section-title"
                    >
                        Portfolio
                    </h3>

                    <div
                        class="modal-portfolio"
                    >

                        ${portfolio
                            .map(
                                function (imagePath) {

                                    return `

                                        <img
                                            src="${escapeHTML(
                                                buildImageURL(
                                                    imagePath
                                                )
                                            )}"
                                            alt="Vendor portfolio"
                                        >

                                    `;

                                }
                            )
                            .join("")}

                    </div>
                  `
                : ""
        }



        ${
            status ===
            "pending"
                ? `
                    <div
                        class="modal-actions"
                    >

                        <button
                            type="button"
                            class="modal-approve"
                            id="modalApproveButton"
                        >
                            Approve Vendor
                        </button>

                        <button
                            type="button"
                            class="modal-reject"
                            id="modalRejectButton"
                        >
                            Reject Vendor
                        </button>

                    </div>
                  `
                : ""
        }

    `;


    if (
        status ===
        "pending"
    ) {

        const modalApproveButton =
            document.getElementById(
                "modalApproveButton"
            );

        const modalRejectButton =
            document.getElementById(
                "modalRejectButton"
            );


        if (modalApproveButton) {

            modalApproveButton.addEventListener(
                "click",
                function () {

                    updateVendorStatus(
                        vendor._id,
                        "approved"
                    );

                }
            );

        }


        if (modalRejectButton) {

            modalRejectButton.addEventListener(
                "click",
                function () {

                    updateVendorStatus(
                        vendor._id,
                        "rejected"
                    );

                }
            );

        }

    }


    vendorModal.classList.add(
        "open"
    );

    vendorModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// =========================================================
// CREATE MODAL DETAIL BOX
// =========================================================

function createDetailBox(
    label,
    value
) {

    return `

        <div
            class="modal-detail-box"
        >

            <label>
                ${escapeHTML(
                    label
                )}
            </label>

            <p>
                ${escapeHTML(
                    value
                )}
            </p>

        </div>

    `;

}


// =========================================================
// CLOSE MODAL
// =========================================================

function closeModal() {

    if (!vendorModal) {

        return;

    }


    vendorModal.classList.remove(
        "open"
    );

    vendorModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (closeVendorModal) {

    closeVendorModal.addEventListener(
        "click",
        closeModal
    );

}


const modalBackdrop =
    document.querySelector(
        ".modal-backdrop"
    );


if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeModal
    );

}


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);


// =========================================================
// APPROVE / REJECT VENDOR
// =========================================================

async function updateVendorStatus(
    vendorId,
    newStatus
) {

    const vendor =
        vendors.find(
            function (item) {

                return String(
                    item._id
                ) ===
                String(
                    vendorId
                );

            }
        );


    if (!vendor) {

        return;

    }


    const vendorName =
        getVendorName(
            vendor
        );


    const actionText =
        newStatus ===
        "approved"
            ? "approve"
            : "reject";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionText} "${vendorName}"?`
        );


    if (!confirmed) {

        return;

    }


    // =====================================================
    // BACKEND API
    // =====================================================

    const endpoint =
        newStatus ===
        "approved"

            ? `${API_URL}/${vendorId}/approve`

            : `${API_URL}/${vendorId}/reject`;


    try {

        // Disable buttons while request is running

        const actionButtons =
            document.querySelectorAll(
                ".approve-btn, .reject-btn, .modal-approve, .modal-reject"
            );


        actionButtons.forEach(
            function (button) {

                button.disabled =
                    true;

            }
        );


        const response =
            await fetch(
                endpoint,
                {
                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                `Unable to ${actionText} vendor.`
            );

        }


        if (
            !result.success
        ) {

            throw new Error(
                result.message ||
                `Unable to ${actionText} vendor.`
            );

        }


        // =================================================
        // UPDATE LOCAL DATA
        // =================================================

        vendor.status =
            newStatus;


        // =================================================
        // UPDATE DASHBOARD
        // =================================================

        updateDashboardStats();

        renderRecentVendors();

        renderVendors();


        // =================================================
        // CLOSE MODAL
        // =================================================

        closeModal();


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        alert(
            `Vendor "${vendorName}" has been ${newStatus}.`
        );


    } catch (error) {

        console.error(
            "Vendor status update error:",
            error
        );


        alert(
            `Unable to ${actionText} "${vendorName}".\n\n${error.message}`
        );


        // Re-enable buttons if request failed

        const actionButtons =
            document.querySelectorAll(
                ".approve-btn, .reject-btn, .modal-approve, .modal-reject"
            );


        actionButtons.forEach(
            function (button) {

                button.disabled =
                    false;

            }
        );

    }

}


// =========================================================
// REFRESH BUTTONS
// =========================================================

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        loadVendors
    );

}


if (vendorRefreshButton) {

    vendorRefreshButton.addEventListener(
        "click",
        loadVendors
    );

}


// =========================================================
// INITIAL LOAD
// =========================================================

loadVendors();