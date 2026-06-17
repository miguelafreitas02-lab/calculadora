import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { t } from './i18n.js';

let currentUserDoc = null;
let currentFirebaseUser = null;

// UI Elements
const authContainer = document.getElementById('auth-container');
const btnLogin = document.getElementById('btn-login');
const userProfileMenu = document.getElementById('user-profile-menu');
const btnUserAvatar = document.getElementById('btn-user-avatar');
const userDropdown = document.getElementById('user-dropdown');
const authModal = document.getElementById('auth-modal');
const authModalClose = document.getElementById('auth-modal-close');
const profileModal = document.getElementById('profile-modal');
const profileModalClose = document.getElementById('profile-modal-close');
const btnUpgradeNav = document.getElementById('btn-upgrade-nav');

// Form UI Elements
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const authForm = document.getElementById('auth-form');
const inputEmail = document.getElementById('auth-email');
const inputPassword = document.getElementById('auth-password');
const inputConfirmPassword = document.getElementById('auth-confirm-password');
const groupConfirmPassword = document.getElementById('group-confirm-password');
const authErrorMsg = document.getElementById('auth-error-msg');
const btnSubmitAuth = document.getElementById('btn-submit-auth');
const linkForgotPassword = document.getElementById('link-forgot-password');
const btnGoogleLogin = document.getElementById('btn-google-login');

// Premium UI Elements
const authModalTitle = document.getElementById('auth-modal-title');
const togglePasswordBtn = document.getElementById('toggle-password');
const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

// State
let isSignupMode = false;

// Initialize
export function initAuth() {
  authContainer.style.display = 'block';

  // Toggle dropdown
  btnUserAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    userDropdown.style.display = 'none';
  });
  userDropdown.addEventListener('click', (e) => e.stopPropagation());

  // Modal Triggers
  btnLogin.addEventListener('click', () => openAuthModal());
  authModalClose.addEventListener('click', closeAuthModal);
  
  if (profileModal) {
    profileModalClose.addEventListener('click', () => profileModal.close());
    btnUpgradeNav.addEventListener('click', () => {
      userDropdown.style.display = 'none';
      profileModal.showModal();
    });
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) profileModal.close();
    });
  }

  // Close auth modal when clicking outside content
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Tabs
  tabLogin.addEventListener('click', () => setMode(false));
  tabSignup.addEventListener('click', () => setMode(true));

  // Form Submit
  authForm.addEventListener('submit', handleAuthSubmit);

  // Google Login
  btnGoogleLogin.addEventListener('click', handleGoogleLogin);

  // Forgot Password
  linkForgotPassword.addEventListener('click', handleForgotPassword);

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth);
  });

  // Toggle Password Visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => togglePassword(inputPassword, togglePasswordBtn));
  }
  if (toggleConfirmPasswordBtn) {
    toggleConfirmPasswordBtn.addEventListener('click', () => togglePassword(inputConfirmPassword, toggleConfirmPasswordBtn));
  }

  // Auth Observer
  onAuthStateChanged(auth, handleAuthStateChanged);

  // Pro Feature Cards Setup
  const proBtns = [
    document.getElementById('btn-pro-export-pdf'),
    document.getElementById('btn-pro-reverse-calc'),
    document.getElementById('btn-pro-projection'),
    document.getElementById('btn-pro-save-scenarios')
  ];

  proBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', async () => {
        const canAccess = await window.requireAuthOrPro();
        if (canAccess) {
          // Future implementation: execute the pro functionality
          console.log('User is PRO, executing functionality for', btn.id);
          alert('Funcionalidade PRO ativada! (Em desenvolvimento)');
        }
      });
    }
  });
}

function openAuthModal() {
  authModal.showModal();
  setMode(false);
  authErrorMsg.style.display = 'none';
  authForm.reset();
}

export function closeAuthModal() {
  authModal.close();
}

function setMode(signup) {
  isSignupMode = signup;
  authErrorMsg.style.display = 'none';
  const authModalSubtitle = document.querySelector('.premium-modal-subtitle');
  if (signup) {
    if (authModalTitle) authModalTitle.textContent = 'Comece gratuitamente';
    if (authModalSubtitle) authModalSubtitle.textContent = 'Crie sua conta para acessar os recursos PRO';
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    groupConfirmPassword.style.display = 'block';
    inputConfirmPassword.required = true;
    btnSubmitAuth.textContent = t('auth.submit_signup') || 'Criar conta';
    linkForgotPassword.style.display = 'none';
  } else {
    if (authModalTitle) authModalTitle.textContent = 'Bem-vindo de volta';
    if (authModalSubtitle) authModalSubtitle.textContent = 'Acesse sua conta para continuar';
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    groupConfirmPassword.style.display = 'none';
    inputConfirmPassword.required = false;
    btnSubmitAuth.textContent = t('auth.submit_login') || 'Entrar';
    linkForgotPassword.style.display = 'block';
  }
}

function togglePassword(inputEl, btnEl) {
  if (inputEl.type === 'password') {
    inputEl.type = 'text';
    btnEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>';
  } else {
    inputEl.type = 'password';
    btnEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

function showError(code) {
  let msg = t(`auth.err_default`) || 'Authentication error. Try again.';
  if (code === 'auth/invalid-email') msg = t('auth.err_invalid_email');
  if (code === 'auth/user-not-found') msg = t('auth.err_user_not_found');
  if (code === 'auth/wrong-password') msg = t('auth.err_wrong_password');
  if (code === 'auth/email-already-in-use') msg = t('auth.err_email_in_use');
  if (code === 'auth/weak-password') msg = t('auth.err_weak_password');
  
  authErrorMsg.textContent = msg;
  authErrorMsg.style.display = 'block';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  authErrorMsg.style.display = 'none';

  if (isSignupMode) {
    const confirmPassword = inputConfirmPassword.value;
    if (password !== confirmPassword) {
      showError('auth/wrong-password'); // Reuse error key or create a new one
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createInitialUserDoc(userCredential.user);
      closeAuthModal();
    } catch (error) {
      showError(error.code);
    }
  } else {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      closeAuthModal();
    } catch (error) {
      showError(error.code);
    }
  }
}

async function handleGoogleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    await createInitialUserDoc(userCredential.user);
    closeAuthModal();
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      showError(error.code);
    }
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const email = inputEmail.value.trim();
  if (!email) {
    showError('auth/invalid-email');
    return;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    authErrorMsg.style.color = '#1DB954'; // Success color
    authErrorMsg.textContent = t('auth.reset_email_sent') || 'Recovery email sent.';
    authErrorMsg.style.display = 'block';
    
    // reset color after 3s
    setTimeout(() => {
      authErrorMsg.style.display = 'none';
      authErrorMsg.style.color = '#ff4d4d';
    }, 3000);
  } catch (error) {
    showError(error.code);
  }
}

async function createInitialUserDoc(user) {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      plan: 'free',
      createdAt: serverTimestamp(),
      upgradedAt: null
    });
  }
}

async function handleAuthStateChanged(user) {
  currentFirebaseUser = user;
  
  if (user) {
    // Logged in
    btnLogin.style.display = 'none';
    userProfileMenu.style.display = 'block';
    
    document.getElementById('user-initial').textContent = user.email.charAt(0).toUpperCase();
    document.getElementById('user-email').textContent = user.email;
    
    // Fetch user document
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        currentUserDoc = docSnap.data();
        updateUserUI();
      } else {
        // Fallback if doc doesn't exist yet
        try {
          await createInitialUserDoc(user);
          const retrySnap = await getDoc(userRef);
          currentUserDoc = retrySnap.data();
        } catch(innerErr) {
          console.warn("Could not create/fetch initial user doc:", innerErr);
        }
        updateUserUI();
      }
    } catch(err) {
      console.warn("Error fetching user data:", err);
      updateUserUI(); // Still update UI to show free state
    }
  } else {
    // Logged out
    currentUserDoc = null;
    btnLogin.style.display = 'block';
    userProfileMenu.style.display = 'none';
    updateUserUI();
  }
  
  // Dispatch event for other modules to re-render locks
  document.dispatchEvent(new CustomEvent('authStateUpdated'));
}

function updateUserUI() {
  const badge = document.getElementById('user-badge');
  const planText = document.getElementById('user-plan');
  const btnUpgrade = document.getElementById('btn-upgrade-nav');
  
  // Profile Modal Elements
  const pAvatar = document.getElementById('profile-modal-avatar');
  const pEmail = document.getElementById('profile-modal-email');
  const pBadge = document.getElementById('profile-modal-plan-badge');
  const pDate = document.getElementById('profile-modal-date');
  const pFreeView = document.getElementById('profile-free-view');
  const pProView = document.getElementById('profile-pro-view');

  if (pAvatar && currentFirebaseUser) {
    pAvatar.textContent = currentFirebaseUser.email.charAt(0).toUpperCase();
    pEmail.textContent = currentFirebaseUser.email;
  }
  
  if (currentUserDoc && currentUserDoc.plan === 'pro') {
    badge.textContent = t('auth.badge_pro') || 'PRO';
    badge.className = 'badge-pro text-gradient-pro';
    planText.textContent = t('auth.plan_pro') || 'Plan: Pro';
    btnUpgrade.style.display = 'none';

    if (pBadge) {
      pBadge.textContent = 'PRO';
      pBadge.className = 'badge-pro text-gradient-pro';
      pFreeView.style.display = 'none';
      pProView.style.display = 'block';
    }
    
    // Hide locks
    document.querySelectorAll('.pro-lock-icon').forEach(el => el.style.display = 'none');
  } else {
    badge.textContent = t('auth.badge_free') || 'FREE';
    badge.className = 'badge-free';
    planText.textContent = t('auth.plan_free') || 'Plan: Free';
    btnUpgrade.style.display = 'block';

    if (pBadge) {
      pBadge.textContent = 'FREE';
      pBadge.className = 'badge-free';
      pFreeView.style.display = 'block';
      pProView.style.display = 'none';
    }

    // Show locks
    document.querySelectorAll('.pro-lock-icon').forEach(el => el.style.display = 'block');
  }
  
  if (pDate && currentUserDoc && currentUserDoc.createdAt) {
    // If it's a serverTimestamp that hasn't synced yet, it might be null initially
    if (currentUserDoc.createdAt.toDate) {
      const d = currentUserDoc.createdAt.toDate();
      pDate.textContent = `Membro desde: ${d.toLocaleDateString()}`;
    }
  }
}

// Global helper for feature locks
window.isUserPro = async function() {
  if (!currentFirebaseUser) return false;
  if (!currentUserDoc) {
    // Fallback sync fetch if not loaded
    try {
      const userRef = doc(db, 'users', currentFirebaseUser.uid);
      const docSnap = await getDoc(userRef);
      if(docSnap.exists()) currentUserDoc = docSnap.data();
    } catch(err) {
      console.warn("isUserPro fallback fetch failed:", err);
    }
  }
  return currentUserDoc && currentUserDoc.plan === 'pro';
};

window.requireAuthOrPro = async function() {
  console.log("requireAuthOrPro started", { currentFirebaseUser });
  if (!currentFirebaseUser) {
    openAuthModal();
    return false;
  }
  
  try {
    const isPro = await window.isUserPro();
    console.log("requireAuthOrPro -> isPro:", isPro);
    if (!isPro) {
      console.log("requireAuthOrPro -> showing profileModal");
      if (profileModal) profileModal.showModal();
      return false;
    }
  } catch(err) {
    console.error("requireAuthOrPro error:", err);
  }
  
  return true;
};
