import {
  Category,
  ContractStatusName,
  JobLevel,
  PaymentMethod,
  Role,
  SubCategory,
} from "@prisma/client";
import {
  NotificationContent,
  NotificationSeverity,
} from "@/common/utils/types";

const staticValues = {
  label: {
    name: "Nom",
    email: "Email",
    status: "Status",
    active: "Actif",
    suspended: "Suspendu",
    address: "Adresse",
    category: "Catégorie",
    contract: "Contrat",
    companyName: "Raison sociale",
    information: "Information",
    website: "Site web",
    logo: "Logo",
    chooseCategory: "Choisir une categorie",
    representative: "Responsable",
    phone: "Telephone",
    fullName: "Nom complet",
    photo: "Photo",
    scan: "Scan",
    startDate: "Date de début",
    endDate: "Date de fin",
    validity: "Validité",
    paymentMethod: "Méthode de paiement",
    choosePaymentMethod: "Choisir une méthode de paiement",
    partner: "Partenaire",
    title: "Titre",
    subCategory: "Sous catégorie",
    description: "Description",
    choosePartner: "Choisir le partenaire",
    reductionPercentage: "Pourcentage de réduction",
    initialPrice: "Prix initial",
    finalPrice: "Prix final",
    image: "Image",
    onePromoCode: "Un Code Promo",
    multiplePromoCodes: "Plusieurs Code Promo",
    promoCode: "Code (e.g. CODE1)",
    usageLimit: "Limite d'usage",
    promoCodes: "Codes (e.g. CODE1, CODE2, CODE3...)",
    coupon: "Coupon",
    employee: "Salarié",
    password: "Mot de passe",
    oldPassword: "Mot de passe actuelle",
    newPassword: "Nouveau mot de passe",
    retypeNewPassword: "Confirmer le nouveau mot de passe",
    role: "Role",
    enterYourEmail: "Entrer votre e-mail",
    pregeneratedCoupon: "Coupon prégénéré",
    generatedCoupon: "Coupon généré",
    generatedCouponData: "Données à remplir le template",
    fieldName: "Clé",
    value: "Valeur",
    conditions: "Conditions",
    maxNumberOfEmployees: "Nombre max de salariés",
  },
  action: {
    disable: "Désactiver",
    enable: "Activer",
    reset: "Reinitialiser",
    suspend: "Suspendre",
    reactivate: "Ré-activer",
    add: "Ajouter",
    update: "Modifier",
    delete: "Supprimer",
    adminAdd: "Ajouter un admin",
    adminUpdate: "Modifier un admin",
    customerAdd: "Ajouter un client",
    customerUpdate: "Modifier un client",
    customerDetail: "Détails client",
    partnerAdd: "Ajouter un partenaire",
    partnerUpdate: "Modifier le partenaire",
    partnerDetail: "Détails partenaire",
    archive: "Archiver",
    signOut: "Se déconnecter",
    confirm: "Confirmer",
    addGeneratedCouponData: "Ajouter",
    cancel: "Annuler",
  },
  confirmation: {
    areYouSure: "Êtes-vous sûr ?",
    adminResetPassword:
      "Le mot de passe sera réinitialisé et un email sera envoyé à l'adresse de l'administrateur concerné.",
    adminSuspendAccount:
      "Le compte de cet administrateur sera suspendu, il ne pourra pas se connecter. Vous pourrez le réactiver à tout moment.",
    adminReactivateAccount: "le compte de cet administrateur sera réactivé.",
    adminDelete:
      "Cet administrateur sera supprimé, il perdra l'accès à la plateforme.",
    customerDelete:
      "Ces ressources seront également supprimées si vous supprimez ce client:\n- Offres ajoutées par ce client.\n- Publications ajoutées par ce client.\n- Salariés de ce client, et leurs comptes tandeem.\n- Comptes administrateur liés à ce client.",
    partnerDelete:
      "Si vous supprimez ce partenaire, ses offres seront également supprimées.",
    offerLevel1Disable:
      "La désactivation de cette offre la rendra indisponible à tous les clients, y compris ceux qui l'ont déjà acceptée.",
    offerLevel1Enable:
      "L'activation cette offre la rendra immédiatement disponible à tous les clients.",
    offerLeve1Delete: "Êtes-vous sûr de vouloir supprimer cette offre ?",
    ideaBoxArchive:
      "Si vous archivez cette idée, elle ne vous apparaîtra plus, elle sera cependant toujours disponible pour le salarié.",
    mediaDelete:
      "Êtes-vous sûr de vouloir supprimer ce média de la bibliothèque ?",
  },
  tooltip: {
    adminResetPassword:
      "Réinitialisé le mot de passe du compte de cet administrateur",
    adminSuspendAccount: "Suspendre le compte de cet administrateur",
    adminReactivateAccount: "Ré-activer le compte de cet administrateur",
    customerUpdateCategory:
      "Si vous changez la catégorie, toutes les offres associées à ce client se verront attribuer une catégorie 'N/A'",
    customerAccountEmail: "L'email du compte admin de ce client.",
    partnerUpdateCategory:
      "Si vous changez la catégorie, toutes les offres associées à ce partenaire se verront attribuer une catégorie 'N/A'",
    offerDisable: "Désactiver l'offre",
    offerEnable: "Activer l'offre",
    sixteenByNineAspectRatio:
      "Pour un meilleur affichage, veuillez fournir une image au format 16/9 ou 16/10 (par exemple 1920x1080 ou 1920x1200).",
  },
  notification: {
    unexpectedError: {
      severity: NotificationSeverity.ERROR,
      message:
        "Une erreur inattendue s'est produite, veuillez réessayer ou contacter le support si elle persiste",
    },
    passwordNotMatch: {
      severity: NotificationSeverity.ERROR,
      message:
        "Le mot de passe que vous avez saisi ne correspond pas à nos enregistrements",
    },
    passwordUpdatedSuccessfully: {
      severity: NotificationSeverity.SUCCESS,
      message: "Votre mot de passe a été mis à jour avec succès",
    },
    resourceNotFound: {
      severity: NotificationSeverity.ERROR,
      message:
        "Nous n'avons pas pu localiser la ressource que vous essayez de supprimer",
    },
    deleteActionNotPermitted: {
      severity: NotificationSeverity.ERROR,
      message:
        "Vous ne disposez pas de privilèges suffisants pour supprimer la ressource en question",
    },
    deleteActionSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "La ressource a été supprimée avec succès",
    },
    emailAlreadyExists: {
      severity: NotificationSeverity.WARNING,
      message:
        "L'e-mail que vous avez saisi est déjà associé à un autre utilisateur de tandeem",
    },
    adminAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'administrateur a été ajouté avec succès",
    },
    adminUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'administrateur a été mis à jour avec succès",
    },
    adminDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'administrateur a été supprimé avec succès",
    },
    adminEnabledSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'administrateur a été activé avec succès",
    },
    adminDisabledSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'administrateur a été désactivé avec succès",
    },
    adminPasswordResetSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "Le mot de passe de l'administrateur a été réinitialisé avec succès, un email a été envoyé à son adresse email",
    },
    contractUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Les informations du contrat ont été mises à jour avec succès",
    },
    customerAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le client a été ajouté avec succès",
    },
    customerUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le client a été mis à jour avec succèss",
    },
    customerDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le client a été supprimé avec succès",
    },
    customerNotFound: {
      severity: NotificationSeverity.ERROR,
      message:
        "Nous n'avons pas pu localiser le client demandé dans nos enregistrements",
    },
    employeeAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le salarié a été ajouté avec succès",
    },
    employeeUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le salarié a été mis à jour avec succèss",
    },
    employeeDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le salarié a été supprimé avec succès",
    },
    employeePasswordResetSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "Le mot de passe du salarié a été réinitialisé avec succès, un email a été envoyé à son adresse email",
    },
    mediaAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le média a été ajouté avec succès à la bibliothèque",
    },
    mediaUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le média a été mis à jour avec succès",
    },
    mediaDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le média a été supprimé de la bibliothèque avec succès",
    },
    offerUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'offre a été mise à jour avec succès",
    },
    offerAcceptedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "L'offre a été acceptée avec succès, elle est désormais disponible pour vos collaborateurs",
    },
    offerUnacceptedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "L'offre a été des-acceptée avec succès, elle n'est plus disponible pour vos collaborateurs",
    },
    offerDisabledSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "L'offre a été désactivée avec succès, elle ne sera plus disponible pour personne",
    },
    offerEnabledSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'offre a été activée avec succès",
    },
    offerAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'offre a été ajouté avec succès",
    },
    offerDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'offre a été supprimé avec succès",
    },
    partnerAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le partenaire a été ajouté avec succès",
    },
    partnerUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le partenaire a été mise à jour avec succès",
    },
    partnerDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le partenaire a été supprimé avec succès",
    },
    partnerNotFound: {
      severity: NotificationSeverity.ERROR,
      message:
        "Nous n'avons pas pu localiser le partenaire demandé dans nos enregistrements",
    },
    publicationAddedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le publication a été ajouté avec succès",
    },
    publicationUpdatedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le publication a été mise à jour avec succès",
    },
    publicationDeletedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "Le publication a été supprimé avec succès",
    },
    fileTooLarge: {
      severity: NotificationSeverity.WARNING,
      message:
        "Le fichier que vous avez joint dépasse 1 Mo, veuillez le compresser à l'aide d'un outil en ligne avant de le télécharger",
    },
    imageTooLarge: {
      severity: NotificationSeverity.WARNING,
      message:
        "L'image que vous avez joint dépasse 1 Mo, veuillez le compresser à l'aide d'un outil en ligne avant de le télécharger",
    },
    photoTooLarge: {
      severity: NotificationSeverity.WARNING,
      message:
        "La photo que vous avez joint dépasse 1 Mo, veuillez le compresser à l'aide d'un outil en ligne avant de le télécharger",
    },
    emailNotFound: {
      severity: NotificationSeverity.WARNING,
      message:
        "L'e-mail que vous avez saisi n'a aucun compte utilisateur associé",
    },
    emailNotValid: {
      severity: NotificationSeverity.WARNING,
      message: "L'e-mail que vous avez saisi n'est pas valide",
    },
    passwordResetSentSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message:
        "Un courrier contenant les détails de la réinitialisation de votre mot de passe a été envoyé à votre adresse e-mail",
    },
    passwordNotStrong: {
      severity: NotificationSeverity.WARNING,
      message:
        "Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
    },
    confirmPasswordNotMatch: {
      severity: NotificationSeverity.WARNING,
      message: "Les mots de passe que vous avez saisis ne correspondent pas",
    },
    resetTokenExpired: {
      severity: NotificationSeverity.ERROR,
      message:
        "Le jeton que nous vous avons envoyé pour réinitialiser votre mot de passe a expiré",
    },
    resetTokenInvalid: {
      severity: NotificationSeverity.ERROR,
      message: "Le jeton n'est pas valide",
    },
    generateCouponError: {
      severity: NotificationSeverity.ERROR,
      message:
        "Erreur lors de la génération du coupon.\nVeuillez vous assurer que tous les placeholders dans le template ont une paire clé-valeur correspondante dans les données fournies.",
    },
    ideaArchivedSuccess: {
      severity: NotificationSeverity.SUCCESS,
      message: "L'idée a été archivée avec succès",
    },
    maxEmployeesExceeded: {
      severity: NotificationSeverity.ERROR,
      message:
        "Vous avez déjà atteint le nombre maximum de salariés, vous ne pouvez pas en ajouter un nouveau.",
    },
  } as Record<string, NotificationContent>,
  category: {
    [Category.NA]: "N/A",
    [Category.Animals]: "Animaux",
    [Category.MoneyAndFinance]: "Argent et Finance",
    [Category.Beauty]: "Beauté",
    [Category.BabiesAndKids]: "Bébés & Enfants",
    [Category.Wellness]: "Bien être",
    [Category.CultureAndEntertainment]: "Culture & Spectacles",
    [Category.Education]: "Éducation",
    [Category.Food]: "Alimentation",
    [Category.Technology]: "High-tech",
    [Category.HomeAndDecoration]: "Maison et Décoration",
    [Category.Mobility]: "Mobilité",
    [Category.FashionAndAccessories]: "Mode et Accessoires",
    [Category.AmusementParks]: "Parcs de Loisirs",
    [Category.PressAndMagazines]: "Presse & Magazines",
    [Category.Catering]: "Restauration",
    [Category.Health]: "Santé",
    [Category.DigitalServices]: "Services Digitaux",
    [Category.HomeServices]: "Services à domicile",
    [Category.Sports]: "Sport",
    [Category.Travel]: "Voyages",
  },
  role: {
    [Role.TANDEEM]: "Administrateur Supérieur tandeem",
    [Role.TANDEEM2]: "Administrateur tandeem",
    [Role.CUSTOMER]: "Administrateur Supérieur",
    [Role.CUSTOMER2]: "Administrateur",
  } as Record<Role, string>,
  subCategory: {
    [SubCategory.NA]: "N/A",
    [SubCategory.Animals_PetCare]: "Soins pour animaux de compagnie",
    [SubCategory.Animals_PetFood]: "Alimentation pour animaux",
    [SubCategory.Animals_PetAccessories]: "Accessoires pour animaux",
    [SubCategory.MoneyAndFinance_Banking]: "Banque",
    [SubCategory.MoneyAndFinance_Investments]: "Investissements",
    [SubCategory.MoneyAndFinance_LoansAndCredits]: "Prêts et crédits",
    [SubCategory.Beauty_Makeup]: "Maquillage",
    [SubCategory.Beauty_SkinCare]: "Soins de la peau",
    [SubCategory.Beauty_HairCare]: "Coiffure",
    [SubCategory.Beauty_Perfume]: "Parfumerie",
    [SubCategory.BabiesAndKids_BabyClothing]: "Vêtements pour bébés",
    [SubCategory.BabiesAndKids_Toys]: "Jouets",
    [SubCategory.BabiesAndKids_BabyGear]: "Articles de puériculture",
    [SubCategory.Wellness_YogaAndMeditation]: "Yoga et méditation",
    [SubCategory.Wellness_SpaAndMassages]: "Spa, Massages & Hammams",
    [SubCategory.Wellness_Nutrition]: "Nutrition",
    [SubCategory.Wellness_Fitness]: "Remise en forme",
    [SubCategory.CultureAndEntertainment_Concerts]: "Concert",
    [SubCategory.CultureAndEntertainment_Movies]: "Cinéma",
    [SubCategory.CultureAndEntertainment_ArtExhibitions]:
      "Expositions artistiques",
    [SubCategory.CultureAndEntertainment_Theater]: "Théâtre",
    [SubCategory.CultureAndEntertainment_Museum]: "Musée",
    [SubCategory.Education_OnlineCourses]: "Cours en ligne",
    [SubCategory.Education_BooksAndManuals]: "Livres et manuels",
    [SubCategory.Education_SchoolSupplies]: "Matériel scolaire",
    [SubCategory.Education_DaycareAndChildcare]: "Crèche et Garderie",
    [SubCategory.Food_Supermarkets]: "Supermarchés",
    [SubCategory.Food_Butcher]: "Boucherie",
    [SubCategory.Food_Bakery]: "Pâtisserie",
    [SubCategory.Food_Delicatessen]: "Épicerie fine",
    [SubCategory.Technology_PhonesAndTablets]: "Téléphones et tablettes",
    [SubCategory.Technology_ComputersAndAccessories]:
      "Ordinateurs et accessoires",
    [SubCategory.Technology_ElectronicDevices]: "Appareils électroniques",
    [SubCategory.Technology_SmallAppliances]: "Petit Électroménagers",
    [SubCategory.Technology_LargeAppliances]: "Gros Électroménagers",
    [SubCategory.Technology_Repair]: "Réparation",
    [SubCategory.HomeAndDecoration_Furniture]: "Meubles",
    [SubCategory.HomeAndDecoration_InteriorDecoration]: "Décoration intérieure",
    [SubCategory.HomeAndDecoration_DIY]: "Bricolage",
    [SubCategory.Mobility_CarRental]: "Location de véhicules",
    [SubCategory.Mobility_ChauffeuredTransport]:
      "Véhicule de Transport avec Chauffeur",
    [SubCategory.Mobility_Carpooling]: "Co-voiturage",
    [SubCategory.Mobility_PublicTransport]: "Transports en commun",
    [SubCategory.FashionAndAccessories_MensClothing]: "Vêtements pour hommes",
    [SubCategory.FashionAndAccessories_WomensClothing]: "Vêtement pour femmes",
    [SubCategory.FashionAndAccessories_FashionAccessories]:
      "Accessoires de mode",
    [SubCategory.FashionAndAccessories_Shoes]: "Chaussures",
    [SubCategory.AmusementParks_ThemeParks]: "Parcs d’attractions",
    [SubCategory.AmusementParks_ZoosAndAquariums]: "Zoos et aquariums",
    [SubCategory.AmusementParks_NaturalParks]: "Parcs naturels",
    [SubCategory.PressAndMagazines_MagazineSubscriptions]:
      "Abonnements à des magazines",
    [SubCategory.PressAndMagazines_DailyNewspapers]: "Journaux quotidiens",
    [SubCategory.PressAndMagazines_SpecializedJournals]: "Revues spécialisées",
    [SubCategory.Catering_Burger]: "Burger",
    [SubCategory.Catering_Pizza]: "Pizza",
    [SubCategory.Catering_Asian]: "Asiatique",
    [SubCategory.Catering_Oriental]: "Orientale",
    [SubCategory.Catering_Italian]: "Italien",
    [SubCategory.Catering_LatinAmerican]: "Amérique latine",
    [SubCategory.Catering_Mediterranean]: "Méditerranéen",
    [SubCategory.Catering_International]: "International",
    [SubCategory.Health_Pharmacy]: "Pharmacie",
    [SubCategory.Health_Laboratory]: "Laboratoire",
    [SubCategory.Health_MedicalConsultations]: "Consultations médicales",
    [SubCategory.Health_HealthProducts]: "Produits de santé",
    [SubCategory.DigitalServices_VODStreaming]: "VOD Streaming",
    [SubCategory.DigitalServices_MusicStreaming]: "Musique Streaming",
    [SubCategory.HomeServices_Housekeeping]: "Ménage",
    [SubCategory.HomeServices_Gardening]: "Jardinage",
    [SubCategory.HomeServices_Repairs]: "Réparations",
    [SubCategory.Sports_SportingGoods]: "Équipement de sport",
    [SubCategory.Sports_GymsAndFitness]: "Salle de sport & Fitness",
    [SubCategory.Sports_OtherSportsActivities]: "Autre activité sportive",
    [SubCategory.Sports_Ticketing]: "Billetterie",
    [SubCategory.Travel_Plane]: "Avion",
    [SubCategory.Travel_Train]: "Train",
    [SubCategory.Travel_HotelsAndAccommodation]: "Hôtel et autre hébergement",
    [SubCategory.Travel_TravelPackages]: "Forfait Voyage",
  },
  contractStatus: {
    [ContractStatusName.Active]: "Actif",
    [ContractStatusName.SoonToBeEnded]: "Bientôt Terminé",
    [ContractStatusName.Ended]: "Terminé",
    [ContractStatusName.SoonToBeTerminated]: "Bientôt Résilié",
    [ContractStatusName.Terminated]: "Résilié",
  },
  paymentMethod: {
    [PaymentMethod.PromoCode]: "Code Promo",
    [PaymentMethod.Coupon]: "Coupon",
  },
  jobLevel: {
    [JobLevel.BoardMember]: "Conseil d'administration",
    [JobLevel.CEO]: "Président CEO",
    [JobLevel.ExecutiveCommittee]: "Comité de Direction",
    [JobLevel.Manager]: "Manager",
    [JobLevel.ProjectLead]: "Chef de Projet",
    [JobLevel.TeamLead]: "Superviseur/Chef d'équipe",
    [JobLevel.Coordinator]: "Coordinateur",
    [JobLevel.Technician]: "Technicien",
    [JobLevel.Assistant]: "Assistant/adjoint",
    [JobLevel.Intern]: "Stagiaire",
  },
};
export default staticValues;
