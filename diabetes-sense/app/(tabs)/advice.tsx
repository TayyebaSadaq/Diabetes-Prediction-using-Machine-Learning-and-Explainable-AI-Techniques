import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal, Text, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const adviceSections = [
  {
    title: 'General Advice',
    description: 'Basic tips on managing health and diabetes.',
    content: [
      {
        title: 'Diet Tips',
        icon: 'food-apple',
        details: `
- **Whole Grains**: Switch to whole grains like brown rice, oats, quinoa, and whole wheat. They have a lower glycemic index, which helps regulate blood sugar levels.
- **Lean Proteins**: Opt for skinless poultry, fish, legumes, and plant-based protein sources like tofu. These will keep you feeling full and provide essential nutrients.
- **Vegetables**: Include a variety of non-starchy vegetables in your meals. Think leafy greens (spinach, kale), broccoli, cauliflower, and bell peppers.
- **Limit Sugary Snacks**: Stay away from sugary snacks, sodas, and processed foods that cause blood sugar spikes. If you crave something sweet, choose fruits like berries, apples, or pears.
- **Healthy Fats**: Include healthy fats like those found in avocados, nuts, seeds, and olive oil. These fats are good for heart health and can help maintain stable blood sugar levels.
        `,
      },
      {
        title: 'Exercise Tips',
        icon: 'run',
        details: `
- **Consistency is Key**: Aim for at least 30 minutes of moderate activity most days, such as walking, cycling, or swimming. Try to spread it throughout the week rather than doing it all at once.
- **Strength Training**: Include strength training exercises twice a week. This can be as simple as bodyweight exercises (e.g., squats, lunges) or light weights to help increase muscle mass and improve insulin sensitivity.
- **Increase Activity Throughout the Day**: If you can’t dedicate a full 30 minutes at once, try breaking it into shorter sessions. Take the stairs instead of the elevator, or go for a walk after meals to keep your blood sugar steady.
- **Mindful Movement**: Activities like yoga, Pilates, or stretching can reduce stress and improve flexibility. Find something you enjoy, so it doesn’t feel like a chore!
        `,
      },
      {
        title: 'Lifestyle Tips',
        icon: 'human-handsup',
        details: `
- **Healthy Weight**: Aim to maintain a healthy weight. Losing just 5-10% of your body weight can significantly reduce the risk of developing Type 2 diabetes.
- **Sleep**: Aim for 7-9 hours of quality sleep each night. Poor sleep can affect your insulin sensitivity and increase hunger cravings.
- **Stress Management**: Chronic stress can raise blood sugar levels. Try practicing relaxation techniques such as deep breathing, meditation, or spending time outdoors.
- **Avoid Smoking and Limit Alcohol**: Smoking and excessive alcohol consumption increase the risk of complications. If you smoke, consider quitting. Limit alcohol intake to moderate levels.
        `,
      },
      {
        title: 'Mindful Eating',
        icon: 'silverware-fork-knife',
        details: `
- **Portion Control**: Use smaller plates to help control portions and avoid overeating. Listen to your body’s hunger and fullness cues.
- **Regular Meals**: Try to eat at regular intervals to keep your blood sugar stable. Skipping meals can lead to extreme hunger and blood sugar spikes later on.
        `,
      },
    ],
    icon: 'food-apple',
  },
  {
    title: 'Prevention Tips',
    description: 'Ways to lower your risk of developing diabetes.',
    content: [
      {
        title: 'Maintain a Healthy Weight',
        icon: 'weight-lifter',
        details: `
Losing just 5-10% of your body weight can significantly reduce the risk of developing Type 2 diabetes.

Consider working with a healthcare provider or dietitian to create a realistic weight loss plan tailored to your needs.
        `,
      },
      {
        title: 'Eat a Balanced Diet',
        icon: 'food',
        details: `
Follow the tips in the Diet Tips section to maintain a healthy, well-rounded diet.

Focus on foods that help stabilize blood sugar, such as whole grains, lean proteins, vegetables, and healthy fats.

Avoid sugary drinks and opt for water, unsweetened tea, or other low-calorie beverages.
        `,
      },
      {
        title: 'Get Regular Exercise',
        icon: 'run',
        details: `
Aim for at least 30 minutes of moderate physical activity most days of the week. Regular exercise helps your body use insulin more effectively.

Activities like walking, cycling, swimming, or strength training can improve blood sugar control.
        `,
      },
      {
        title: 'Manage Stress',
        icon: 'meditation',
        details: `
Chronic stress can lead to higher blood sugar levels. Practice relaxation techniques such as deep breathing, yoga, or mindfulness to reduce stress.

Spending time in nature or engaging in hobbies you enjoy can also lower stress levels.
        `,
      },
      {
        title: 'Get Regular Health Check-ups',
        icon: 'stethoscope',
        details: `
Stay on top of your health by regularly checking your blood pressure, cholesterol, and blood sugar levels.

Annual check-ups with your doctor or healthcare team can help detect early warning signs of diabetes.
        `,
      },
      {
        title: 'Stop Smoking',
        icon: 'smoking-off',
        details: `
Smoking increases the risk of developing Type 2 diabetes and can also cause complications if you already have diabetes. Quitting is one of the best things you can do for your health.
        `,
      },
      {
        title: 'Limit Alcohol Intake',
        icon: 'glass-cocktail',
        details: `
Alcohol can interfere with blood sugar levels and insulin sensitivity. If you drink, do so in moderation, and always with food.
        `,
      },
    ],
    icon: 'shield-check',
  },
  {
    title: 'When to Seek Help',
    description: 'Recognize warning signs and know when to reach out.',
    content: [
      {
        title: 'Increased Thirst and Urination',
        icon: 'water',
        details: `
Feeling very thirsty and needing to urinate more frequently than usual could be a sign that your body is struggling to regulate blood sugar.
        `,
      },
      {
        title: 'Unexplained Weight Loss',
        icon: 'scale-bathroom',
        details: `
Losing weight without trying, especially if you’re eating normally, may be a sign of uncontrolled diabetes.
        `,
      },
      {
        title: 'Fatigue',
        icon: 'sleep',
        details: `
Feeling unusually tired or weak, even after a good night’s sleep, can be a symptom of diabetes.
        `,
      },
      {
        title: 'Blurry Vision',
        icon: 'eye',
        details: `
High blood sugar can affect the lens of your eyes, leading to blurry vision. If this happens, see an eye specialist.
        `,
      },
      {
        title: 'Slow Healing of Cuts or Wounds',
        icon: 'bandage',
        details: `
Diabetes can impair your body’s ability to heal wounds and fight infections. If cuts or sores are taking longer to heal than usual, consult a doctor.
        `,
      },
      {
        title: 'Tingling or Numbness in Hands or Feet',
        icon: 'hand-heart',
        details: `
Nerve damage (neuropathy) caused by high blood sugar can result in tingling, numbness, or pain in the hands, feet, or legs.
        `,
      },
      {
        title: 'Frequent Infections',
        icon: 'bacteria',
        details: `
Diabetes can make you more susceptible to infections, especially in the urinary tract, skin, or gums.
        `,
      },
    ],
    icon: 'alert-circle',
  },
  {
    title: 'Resources & Support',
    description: 'Helpful websites, forums, and groups for more information.',
    content: [
      {
        title: 'Diabetes UK',
        icon: 'web',
        details: `
Diabetes UK offers a wealth of resources, from educational materials to local support groups. They provide information on how to live with diabetes, prevent complications, and access the latest research and treatment options.
Visit their website at `,
        link: 'https://www.diabetes.org.uk',
      },
      {
        title: 'Online Forums and Communities',
        icon: 'forum',
        details: `
- **Diabetes.co.uk Forum**: A place to connect with others living with diabetes. Share experiences, ask questions, and receive support from a caring community.
- **Reddit (r/diabetes)**: A popular online community where people with diabetes can talk about their experiences, share tips, and discuss the latest in diabetes care.
- **Facebook Groups**: There are many groups for people with diabetes, including ones dedicated to specific types of diabetes or tips on living with diabetes.
        `,
        links: [
          { label: 'Diabetes.co.uk Forum', url: 'https://www.diabetes.co.uk/forum/' },
          { label: 'Reddit (r/diabetes)', url: 'https://www.reddit.com/r/diabetes/' },
        ],
      },
      {
        title: 'Support Groups',
        icon: 'account-group',
        details: `
Local in-person or virtual support groups can offer emotional support and helpful resources. Contact your healthcare provider or local diabetes association for information on groups near you.

Hospitals or diabetes clinics may also host support groups for patients and their families.
        `,
      },
      {
        title: 'Helplines and Counseling',
        icon: 'phone',
        details: `
- **Diabetes UK Helpline**: Available for expert advice and support, including how to deal with challenges you may face managing diabetes. Call **0345 123 2399**, Monday to Friday, 9am to 6pm.
- **Counseling Services**: If you're struggling with stress, anxiety, or depression related to diabetes, it may help to talk to a counselor or mental health professional.
        `,
        link: 'https://www.diabetes.org.uk/how_we_help/helpline',
      },
      {
        title: 'Books & Apps',
        icon: 'book',
        details: `
Many books and apps are designed to help you manage diabetes. Some popular apps include **MySugr** (for logging blood sugar and food intake) and **Carb Manager** (for carb counting).

Check out **The Diabetes Cookbook** or **The Diabetes Plate Method** for easy-to-follow recipes and meal-planning tips.
        `,
        links: [
          { label: 'MySugr App', url: 'https://mysugr.com/' },
          { label: 'Carb Manager App', url: 'https://www.carbmanager.com/' },
        ],
      },
      {
        title: 'Local Clinics & Diabetes Specialists',
        icon: 'hospital',
        details: `
If you need personalized care, consider seeing an endocrinologist or diabetes nurse educator. They can help with medication, treatment plans, and lifestyle changes.

Many clinics also offer diabetes education programs that can help you understand your condition better.
        `,
      },
    ],
    icon: 'account-group',
  },
];

const renderBoldText = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/); // Split text by bold markers (**)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {part.slice(2, -2)} {/* Remove the ** markers */}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const renderDetailsWithLinks = (details, links) => {
  return (
    <>
      {renderBoldText(details)}
      {links &&
        links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkButton}
            onPress={() => Linking.openURL(link.url)}
          >
            <Text style={styles.linkButtonText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
    </>
  );
};

export default function AdviceScreen() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedSubsection, setExpandedSubsection] = useState(null);

  const toggleSubsection = (index) => {
    setExpandedSubsection((prev) => (prev === index ? null : index));
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.introSection}>
        <ThemedText style={styles.introHeader}>Welcome to the Advice Section</ThemedText>
        <ThemedText style={styles.introText}>
          Here you can find helpful tips and resources for managing diabetes, preventing complications, and living a healthier life.
        </ThemedText>
      </ThemedView>

      <View style={styles.tilesContainer}>
        {adviceSections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tile}
            onPress={() => setSelectedSection(section)}
          >
            <Icon name={section.icon} size={40} color="#007BFF" style={styles.tileIcon} />
            <ThemedText style={styles.tileTitle}>{section.title}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSection && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedSection}
          onRequestClose={() => {}} // Disable hardware back button close
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentWrapper}>
              <ThemedView style={styles.modalContent}>
                <ThemedText style={styles.modalHeader}>{selectedSection.title}</ThemedText>
                {selectedSection.content.map((subsection, index) => (
                  <View key={index} style={styles.subsectionContainer}>
                    <TouchableOpacity
                      style={styles.subsectionHeader}
                      onPress={() => toggleSubsection(index)}
                    >
                      <Icon name={subsection.icon} size={24} color="#007BFF" />
                      <ThemedText style={styles.subsectionTitle}>{subsection.title}</ThemedText>
                    </TouchableOpacity>
                    {expandedSubsection === index && (
                      <Text style={styles.subsectionBody}>
                        {renderDetailsWithLinks(subsection.details, subsection.links)}
                      </Text>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedSection(null)} // Close modal only via this button
                >
                  <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  introSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  introHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#007BFF',
  },
  introText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: '#e6f7ff',
    width: '22%', // Adjusted width to fit 4 tiles in a row
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tileIcon: {
    marginBottom: 6, 
  },
  tileTitle: {
    fontSize: 20, 
    fontWeight: '600',
    textAlign: 'center',
    color: '#007BFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContentWrapper: {
    width: '90%', // Reverted to original width
    maxHeight: '80%', // Reverted to original height
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    height: 'auto', // Allow content to determine height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007BFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  subsectionContainer: {
    marginBottom: 16,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#007BFF',
  },
  subsectionBody: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
    marginLeft: 32,
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 6, 
    marginBottom: 6, 
    paddingVertical: 8, 
    paddingHorizontal: 14, 
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13, // Slightly smaller font size
    textAlign: 'center',
  },
});
