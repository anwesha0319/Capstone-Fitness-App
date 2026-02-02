import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientBackground from '../../components/GradientBackground';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import GlassInput from '../../components/GlassInput';
import AppLogo from '../../components/AppLogo';
import { useTheme } from '../../context/ThemeContext';
import { getTypographyStyle, getIconContainerStyle } from '../../utils/styleHelpers';

/**
 * Color System Demo Screen
 * Showcases all components with the AI Sidekick color system
 */
const ColorSystemDemo = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.section}>
          <AppLogo size={100} />
          <Text style={[getTypographyStyle(colors, 'h1'), styles.centerText]}>
            FitWell
          </Text>
          <Text style={[getTypographyStyle(colors, 'body'), styles.centerText]}>
            AI Sidekick Color System Demo
          </Text>
        </View>

        {/* Typography Section */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Typography Styles
          </Text>
          <View style={styles.spacer} />
          <Text style={getTypographyStyle(colors, 'h1')}>
            Heading 1 - Deep Purple Black
          </Text>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Heading 2 - Dark Purple
          </Text>
          <Text style={getTypographyStyle(colors, 'h3')}>
            Heading 3 - Medium Purple
          </Text>
          <Text style={getTypographyStyle(colors, 'body')}>
            Body text - Medium purple-gray with good readability
          </Text>
          <Text style={getTypographyStyle(colors, 'label')}>
            Label text - Muted purple for secondary info
          </Text>
          <Text style={getTypographyStyle(colors, 'caption')}>
            Caption text - Small supporting text
          </Text>
          <Text style={getTypographyStyle(colors, 'accent')}>
            Accent text - Vibrant purple for emphasis
          </Text>
        </GlassCard>

        {/* Button Variants */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Button Variants
          </Text>
          <View style={styles.spacer} />
          
          <GlassButton
            variant="primary"
            size="large"
            onPress={() => {}}
            icon={<Icon name="check-circle" size={20} color="#FFF" />}
          >
            Primary Button
          </GlassButton>

          <View style={styles.buttonSpacer} />

          <GlassButton
            variant="secondary"
            size="medium"
            onPress={() => {}}
            icon={<Icon name="heart" size={20} color="#8B5CF6" />}
          >
            Secondary Button
          </GlassButton>

          <View style={styles.buttonSpacer} />

          <GlassButton
            variant="ghost"
            size="small"
            onPress={() => {}}
          >
            Ghost Button
          </GlassButton>

          <View style={styles.buttonSpacer} />

          <GlassButton
            variant="primary"
            size="medium"
            onPress={() => {}}
            disabled
          >
            Disabled Button
          </GlassButton>
        </GlassCard>

        {/* Input Fields */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Input Fields
          </Text>
          <View style={styles.spacer} />

          <GlassInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon={<Icon name="email" size={20} color="#8B5CF6" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <GlassInput
            label="Message"
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </GlassCard>

        {/* Icon Containers */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Feature Icons
          </Text>
          <View style={styles.spacer} />

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconApple + '30')}>
                <Icon name="food-apple" size={28} color={colors.iconApple} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Nutrition
              </Text>
            </View>

            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconFire + '30')}>
                <Icon name="fire" size={28} color={colors.iconFire} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Calories
              </Text>
            </View>

            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconWater + '30')}>
                <Icon name="water" size={28} color={colors.iconWater} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Hydration
              </Text>
            </View>

            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconHeart + '30')}>
                <Icon name="heart-pulse" size={28} color={colors.iconHeart} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Heart Rate
              </Text>
            </View>

            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconDumbbell + '30')}>
                <Icon name="dumbbell" size={28} color={colors.iconDumbbell} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Workout
              </Text>
            </View>

            <View style={styles.iconItem}>
              <View style={getIconContainerStyle(colors, 'large', colors.iconSleep + '30')}>
                <Icon name="sleep" size={28} color={colors.iconSleep} />
              </View>
              <Text style={[getTypographyStyle(colors, 'caption'), styles.centerText]}>
                Sleep
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Nested Cards */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Nested Glass Cards
          </Text>
          <View style={styles.spacer} />

          <GlassCard variant="nested">
            <Text style={getTypographyStyle(colors, 'bodyMedium')}>
              This is a nested card with 35% opacity
            </Text>
            <Text style={getTypographyStyle(colors, 'body')}>
              Perfect for layered content and hierarchical information
            </Text>
          </GlassCard>

          <View style={styles.spacer} />

          <GlassCard variant="nested">
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={getTypographyStyle(colors, 'h1')}>7,842</Text>
                <Text style={getTypographyStyle(colors, 'label')}>Steps</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={getTypographyStyle(colors, 'h1')}>420</Text>
                <Text style={getTypographyStyle(colors, 'label')}>Calories</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={getTypographyStyle(colors, 'h1')}>7.2</Text>
                <Text style={getTypographyStyle(colors, 'label')}>Hours</Text>
              </View>
            </View>
          </GlassCard>
        </GlassCard>

        {/* Color Palette Reference */}
        <GlassCard variant="primary" style={styles.section}>
          <Text style={getTypographyStyle(colors, 'h2')}>
            Color Palette
          </Text>
          <View style={styles.spacer} />

          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.accent }]} />
            <View style={styles.colorInfo}>
              <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                Primary Accent
              </Text>
              <Text style={getTypographyStyle(colors, 'caption')}>
                #8B5CF6
              </Text>
            </View>
          </View>

          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.accentLight }]} />
            <View style={styles.colorInfo}>
              <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                Light Accent
              </Text>
              <Text style={getTypographyStyle(colors, 'caption')}>
                #A78BFA
              </Text>
            </View>
          </View>

          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.accentLighter }]} />
            <View style={styles.colorInfo}>
              <Text style={getTypographyStyle(colors, 'bodyMedium')}>
                Lighter Accent
              </Text>
              <Text style={getTypographyStyle(colors, 'caption')}>
                #C4B5FD
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  spacer: {
    height: 16,
  },
  buttonSpacer: {
    height: 12,
  },
  centerText: {
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconItem: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  colorInfo: {
    flex: 1,
  },
  bottomSpace: {
    height: 40,
  },
});

export default ColorSystemDemo;
