var details = {};

const githubDetails = {
  token: "0a1b7aef6c183b248f3a98d7f826dae3b196bc69",
  login: "godsonaniagudo",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + githubDetails.token,
};

const body = {
  query: `
    query { 
      user(login : "godsonaniagudo"){
        avatarUrl
        name
        bio
        login
        websiteUrl
        twitterUsername
        location
        followers {
          totalCount
        }
        following {
          totalCount
        }
        starredRepositories {
          totalCount
        }
        
        repositories (last : 20){
          totalCount
          nodes {
            description
            name
            updatedAt
            viewerHasStarred
            isPrivate
            primaryLanguage {
              name
            }
          }
        }
      }
    }`,
};

const baseUrl = "https://api.github.com/graphql";

async function getDetails() {
  const userDetails = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  details = await userDetails.json();
  setDetails();
}

getDetails();

//Load user details fetched from Github API into views

function setDetails() {
  document.getElementById("accountName").innerHTML = details.data.user.name;
  document.getElementById("accountLogin").innerHTML = details.data.user.login;
  document.getElementById("accountBio").innerHTML = details.data.user.bio;
  document.getElementById("accountFollowersCount").innerHTML =
    details.data.user.followers.totalCount;
  document.getElementById("accountFollowingCount").innerHTML =
    details.data.user.following.totalCount;
  document.getElementById("accountStarsCount").innerHTML =
    details.data.user.starredRepositories.totalCount;
  document.getElementById("accountLocation").innerHTML =
    details.data.user.location;
  document.getElementById("accountTwitter").innerHTML =
    "@" + details.data.user.twitterUsername;
  document.getElementById("accountWebsite").innerHTML =
    details.data.user.websiteUrl;
  document.getElementById("accountTwitter").href =
    "https://twitter.com/" + details.data.user.twitterUsername;
  document.getElementById("accountWebsite").href = `http://${details.data.user.websiteUrl}`;
  document.getElementById(
    "accountRepositioriesCount"
  ).innerHTML = 
  details.data.user.repositories.totalCount;
  document.getElementById("menuProfilePic").src = details.data.user.avatarUrl;
  document.getElementById("avatar").src = details.data.user.avatarUrl;
  document.getElementById("mobileMenuLoginName").innerHTML =
    details.data.user.login;

  details.data.user.repositories.nodes.forEach((item) =>
    createRepositoryItem(item)
  );
}

function createRepositoryItem(repoDetails) {
  const container = document.createElement("div");
  const containerContent = document.createElement("div");
  const containerLeft = document.createElement("div");
  const containerRight = document.createElement("div");
  const titleText = document.createElement("a");
  const privacyStatus = document.createElement("span");
  const descriptionText = document.createElement("p");
  const languageContainer = document.createElement("div");
  const languageIcon = document.createElement("div");
  const languageText = document.createElement("p");
  const lastUpdatedText = document.createElement("p");
  const metaDataDiv = document.createElement("div");

  const starredContainer = document.createElement("span");
  const starIcon = document.createElement("img");
  const starCountText = document.createElement("div");

  const divider = document.createElement("hr");

  container.classList.add("repoItemContainer");
  privacyStatus.classList.add("privacyStatus");
  containerLeft.classList.add("containerLeft");
  containerRight.classList.add("containerRight");
  metaDataDiv.classList.add("metaDataDiv");
  containerContent.classList.add("containerContent");

  container.appendChild(containerContent);
  container.appendChild(divider);

  containerContent.appendChild(containerLeft);
  containerContent.appendChild(containerRight);

  containerLeft.appendChild(titleText);
  containerLeft.appendChild(privacyStatus);
  containerLeft.appendChild(descriptionText);
  containerLeft.appendChild(metaDataDiv);

  if (
    repoDetails.primaryLanguage !== null &&
    repoDetails.primaryLanguage !== "null"
  ) {
    metaDataDiv.appendChild(languageContainer);
    languageContainer.appendChild(languageIcon);
    languageContainer.appendChild(languageText);

    languageIcon.classList.add("languageIcon");
    languageIcon.style.width = "14px";
    languageIcon.style.height = "14px";
    languageIcon.style.borderStyle = "none";
    languageIcon.style.borderRadius = "7px";

    switch (repoDetails.primaryLanguage.name) {
      case "JavaScript":
        languageIcon.style.backgroundColor = "#F1E05A";
        break;
      case "HTML":
        languageIcon.style.backgroundColor = "#E34C26";
        break;

      case "Kotlin":
        languageIcon.style.backgroundColor = "#F18E33";
        break;

      default:
        break;
    }

    languageText.innerHTML = repoDetails.primaryLanguage.name;
  }

  metaDataDiv.appendChild(lastUpdatedText);

  containerRight.appendChild(starredContainer);

  starredContainer.appendChild(starIcon);
  starredContainer.appendChild(starCountText);

  const currentTimestamp = new Date();
  const updatedDate = new Date(repoDetails.updatedAt);
  const updatedTimeStamp = updatedDate.getTime();

  const updatedSeconds = (currentTimestamp - updatedTimeStamp) / 1000;

  let lastUpdateText = "";

  if (updatedSeconds === 0) {
    lastUpdateText = "Updated Just now";
  } else if (updatedSeconds === 1) {
    lastUpdateText = "Updated 1 second ago";
  } else if (updatedSeconds > 1 && updatedSeconds < 60) {
    lastUpdateText = `Updated ${Math.floor(updatedSeconds)} seconds ago`;
  } else if (updatedSeconds >= 60 && updatedSeconds < 120) {
    lastUpdateText = "Updated 1 minute ago";
  } else if (
    updatedSeconds > 120 &&
    updatedSeconds / 60 > 1 &&
    updatedSeconds / 3600 < 1
  ) {
    lastUpdateText = `Updated ${Math.floor(updatedSeconds / 60)} minutes ago`;
  } else if (updatedSeconds / 3600 === 1) {
    lastUpdateText = "Updated 1 hour ago";
  } else if (updatedSeconds / 3600 > 1 && updatedSeconds / 3600 < 24) {
    lastUpdateText = `Updated ${Math.floor(updatedSeconds / 3600)} hours ago`;
  } else if (updatedSeconds / 86400 <= 1) {
    lastUpdateText = "Updated 1 day ago";
  } else if (updatedSeconds / 86400 > 1 && updatedSeconds / 86400 < 12) {
    lastUpdateText = `Updated ${Math.floor(updatedSeconds / 86400)} days ago`;
  } else if (updatedSeconds / 2.628e6 <= 1) {
    lastUpdateText = "Updated 1 month ago";
  } else {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    lastUpdateText = `Updated ${
      months[updatedDate.getMonth()]
    } ${updatedDate.getDate()} `;
  }

  titleText.innerHTML = repoDetails.name;
  privacyStatus.innerHTML = repoDetails.isPrivate ? "Private" : "";
  descriptionText.innerHTML = repoDetails.description;
  lastUpdatedText.innerHTML = lastUpdateText;
  starCountText.innerHTML = "Star";
  starIcon.src = "https://res.cloudinary.com/theunfreed/image/upload/v1606102206/greystar_pqef5z.svg";

  titleText.href = "#";

  document.getElementById("repoListContainer").prepend(container);
}



//Handle hamburger menu click
let showMenu = false;

document.getElementById("hamburger").addEventListener("click", () => {
  if (showMenu === false) {
    document.getElementById("mainMobileMenu").style.display = "flex";
    showMenu = true;
  } else {
    document.getElementById("mainMobileMenu").style.display = "none";
    showMenu = false;
  }
});

//Handle dropdowns
let showActionsDropdown = false;
let showUserDropdown = false;

document
  .getElementById("userDropDownContainer")
  .addEventListener("click", () => {
    if (showUserDropdown === false) {
      document.getElementById("userDropDown").style.display = "block";
      document.getElementById("actionsDropdown").style.display = "none";
      showUserDropdown = true;
      showActionsDropdown = false;
    } else {
      document.getElementById("userDropDown").style.display = "none";
      showUserDropdown = false;
    }
  });

document
  .getElementById("actionsDropdownContainer")
  .addEventListener("click", () => {
    if (showActionsDropdown === false) {
      document.getElementById("actionsDropdown").style.display = "block";
      document.getElementById("userDropDown").style.display = "none";
      showActionsDropdown = true;
      showUserDropdown = false;
    } else {
      document.getElementById("actionsDropdown").style.display = "none";
      showActionsDropdown = false;
    }
  });

//Close dropdowns and modal if user clicks outside them

window.addEventListener("click", function (evt) {
  var actionsElement = document.getElementById("actionsDropdown"),
    actionsTriggerElement = document.getElementById("actionsDropdownContainer"),
    userElement = document.getElementById("userDropDown"),
    userTriggerElement = document.getElementById("userDropDownContainer"),
    targetElement = evt.target; // clicked element

  do {
    if (
      targetElement == actionsElement ||
      targetElement == actionsTriggerElement ||
      targetElement == userElement ||
      targetElement == userTriggerElement ||
      targetElement == document.getElementById("typeSelector") ||
      targetElement == document.getElementById("languageSelector")
    ) {
      // This is a click inside. Do nothing, just return.

      return;
    } else if (
      targetElement === document.getElementById("closeTypeModalButton") ||
      targetElement === document.getElementById("closeLanguageModalButton")
    ) {
      document.getElementById("typeModal").style.display = "none";
      document.getElementById("languageModal").style.display = "none";
      document.getElementById("overlay").style.display = "none";
      showTypeModal = false;
      showLanguageModal = false;
    }
    // Go up the DOM
    targetElement = targetElement.parentNode;
  } while (targetElement);

  // This is a click outside.
  document.getElementById("actionsDropdown").style.display = "none";
  showActionsDropdown = false;
  document.getElementById("userDropDown").style.display = "none";
  showUserDropdown = false;
  document.getElementById("typeModal").style.display = "none";
  showTypeModal = false;
  document.getElementById("languageModal").style.display = "none";
  showLanguageModal = false;
  document.getElementById("overlay").style.display = "none";
});

//Handle modals

let showTypeModal = false;
let showLanguageModal = false;

document.getElementById("typeSelector").addEventListener("click", () => {
  showHideModal(
    "typeSelector",
    "typeModal",
    showTypeModal,
    "languageModal",
    showLanguageModal
  );
});

document.getElementById("languageSelector").addEventListener("click", () => {
  showHideModal(
    "languageSelector",
    "languageModal",
    showLanguageModal,
    "typeModal",
    showTypeModal
  );
});

function showHideModal(selector, modal, toggler, otherModal, otherToggler) {
  if (toggler === false) {
    document.getElementById("overlay").style.display = "block";
    document.getElementById(modal).style.display = "flex";
    document.getElementById(otherModal).style.display = "none";
    toggler = true;
    otherToggler = false;
  } else {
    document.getElementById("overlay").style.display = "none";
    document.getElementById(modal).style.display = "none";
    toggler = false;
  }
}

if (document.getElementById("closeModalButton")) {
  document.getElementById("closeModalButton").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("typeModal").style.display = "none";
    document.getElementById("languageModal").style.display = "none";
    showTypeModal = false;
    showLanguageModal = false;
  });
}

//Handle edit profile button click
document.getElementById("editProfileButton").addEventListener("click", () => {
  document.getElementById("followersAndLocationDiv").style.display = "none";
  document.getElementsByClassName("editProfileDiv")[0].style.display = "flex";

  document.getElementById("editProfileBio").value = details.data.user.bio;
  document.getElementById("editProfileLocation").value =
    details.data.user.location;
  document.getElementById("editProfileWebsite").value =
    details.data.user.websiteUrl;
  document.getElementById("editProfileTwitterUsername").value =
    details.data.user.twitterUsername;
});

//Handle edit profile div cancel and save buttons
document
  .getElementById("editProfileCancelButton")
  .addEventListener("click", () => {
    closeEditProfileDiv();
  });

document
  .getElementById("editProfileSaveButton")
  .addEventListener("click", () => {
    closeEditProfileDiv();
  });

function closeEditProfileDiv() {
  document.getElementById("followersAndLocationDiv").style.display = "block";
  document.getElementsByClassName("editProfileDiv")[0].style.display = "none";
}
