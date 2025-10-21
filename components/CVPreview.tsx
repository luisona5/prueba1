// components/CVPreview.tsx

import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
  const { personalInfo, experiences, education, skills } = cvData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con foto */}
        <View style={styles.header}>
          {personalInfo.profileImage && (
            <Image
              source={{ uri: personalInfo.profileImage }}
              style={styles.profileImage}
            />
          )}
          <View style={styles.headerText}>
            <Text style={styles.name}>{personalInfo.fullName || "Nombre"}</Text>
            {personalInfo.email && (
              <Text style={styles.contact}>📧 {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contact}>📱 {personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contact}>📍 {personalInfo.location}</Text>
            )}
          </View>
        </View>

        {/* Resumen */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
            <Text style={styles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.endDate || "Actual"}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educación</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                <Text style={styles.itemDate}>{edu.graduationYear}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Habilidades */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            {skills.map((s) => (
              <View key={s.id} style={styles.item}>
                <Text style={styles.itemTitle}>{s.name}</Text>
                <Text style={styles.itemSubtitle}>{s.level}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#3498db",
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  contact: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#2c3e50",
    lineHeight: 20,
    marginTop: 4,
  },
});
