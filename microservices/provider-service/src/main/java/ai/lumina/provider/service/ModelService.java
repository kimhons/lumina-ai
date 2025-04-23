package ai.lumina.provider.service;

import ai.lumina.provider.model.Model;
import ai.lumina.provider.model.Provider;
import ai.lumina.provider.repository.ModelRepository;
import ai.lumina.provider.exception.ModelNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for managing AI models
 */
@Service
public class ModelService {

    private final ModelRepository modelRepository;
    private final ProviderService providerService;

    @Autowired
    public ModelService(ModelRepository modelRepository, ProviderService providerService) {
        this.modelRepository = modelRepository;
        this.providerService = providerService;
    }

    /**
     * Create a new model
     *
     * @param model The model to create
     * @return The created model
     */
    @Transactional
    public Model createModel(Model model) {
        // Generate ID if not provided
        if (model.getId() == null || model.getId().isEmpty()) {
            model.setId(UUID.randomUUID().toString());
        }
        
        // Verify provider exists
        if (model.getProvider() != null && model.getProvider().getId() != null) {
            Provider provider = providerService.getProvider(model.getProvider().getId());
            model.setProvider(provider);
        }
        
        // Set timestamps
        model.setCreatedAt(LocalDateTime.now());
        model.setUpdatedAt(LocalDateTime.now());
        
        return modelRepository.save(model);
    }

    /**
     * Get a model by ID
     *
     * @param id The model ID
     * @return The model if found
     * @throws ModelNotFoundException if model not found
     */
    public Model getModel(String id) {
        return modelRepository.findById(id)
                .orElseThrow(() -> new ModelNotFoundException("Model not found with ID: " + id));
    }

    /**
     * Get a model by ID (optional version)
     *
     * @param id The model ID
     * @return Optional containing the model if found
     */
    public Optional<Model> findModel(String id) {
        return modelRepository.findById(id);
    }

    /**
     * Get all models
     *
     * @return List of all models
     */
    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }

    /**
     * Get models by provider
     *
     * @param providerId The provider ID
     * @return List of models for the specified provider
     */
    public List<Model> getModelsByProvider(String providerId) {
        return modelRepository.findByProviderId(providerId);
    }

    /**
     * Get models by type
     *
     * @param type The model type
     * @return List of models of the specified type
     */
    public List<Model> getModelsByType(Model.ModelType type) {
        return modelRepository.findByType(type);
    }

    /**
     * Get enabled models
     *
     * @return List of enabled models
     */
    public List<Model> getEnabledModels() {
        return modelRepository.findByEnabledTrue();
    }

    /**
     * Get enabled models by provider
     *
     * @param providerId The provider ID
     * @return List of enabled models for the specified provider
     */
    public List<Model> getEnabledModelsByProvider(String providerId) {
        return modelRepository.findByProviderIdAndEnabledTrue(providerId);
    }

    /**
     * Get enabled models by type
     *
     * @param type The model type
     * @return List of enabled models of the specified type
     */
    public List<Model> getEnabledModelsByType(Model.ModelType type) {
        return modelRepository.findByTypeAndEnabledTrue(type);
    }

    /**
     * Get models by provider and type
     *
     * @param providerId The provider ID
     * @param type The model type
     * @return List of models for the specified provider and type
     */
    public List<Model> getModelsByProviderAndType(String providerId, Model.ModelType type) {
        Provider provider = providerService.getProvider(providerId);
        return modelRepository.findByProviderAndType(provider, type);
    }

    /**
     * Get enabled models by provider and type
     *
     * @param providerId The provider ID
     * @param type The model type
     * @return List of enabled models for the specified provider and type
     */
    public List<Model> getEnabledModelsByProviderAndType(String providerId, Model.ModelType type) {
        Provider provider = providerService.getProvider(providerId);
        return modelRepository.findByProviderAndTypeAndEnabledTrue(provider, type);
    }

    /**
     * Get models by context window size greater than or equal to specified value
     *
     * @param contextWindow The minimum context window size
     * @return List of models with context window size greater than or equal to specified value
     */
    public List<Model> getModelsByMinContextWindow(int contextWindow) {
        return modelRepository.findByContextWindowGreaterThanEqual(contextWindow);
    }

    /**
     * Get models ordered by quality score (highest first)
     *
     * @return List of models ordered by quality score
     */
    public List<Model> getModelsOrderedByQuality() {
        return modelRepository.findAllByOrderByQualityScoreDesc();
    }

    /**
     * Get enabled models ordered by quality score (highest first)
     *
     * @return List of enabled models ordered by quality score
     */
    public List<Model> getEnabledModelsOrderedByQuality() {
        return modelRepository.findByEnabledTrueOrderByQualityScoreDesc();
    }

    /**
     * Get models by type ordered by quality score (highest first)
     *
     * @param type The model type
     * @return List of models of the specified type ordered by quality score
     */
    public List<Model> getModelsByTypeOrderedByQuality(Model.ModelType type) {
        return modelRepository.findByTypeOrderByQualityScoreDesc(type);
    }

    /**
     * Get enabled models by type ordered by quality score (highest first)
     *
     * @param type The model type
     * @return List of enabled models of the specified type ordered by quality score
     */
    public List<Model> getEnabledModelsByTypeOrderedByQuality(Model.ModelType type) {
        return modelRepository.findByTypeAndEnabledTrueOrderByQualityScoreDesc(type);
    }

    /**
     * Get models by cost per token less than specified value
     *
     * @param cost The maximum cost per token
     * @return List of models with cost per token less than specified value
     */
    public List<Model> getModelsByMaxCost(double cost) {
        return modelRepository.findByAverageCostLessThan(cost);
    }

    /**
     * Update a model
     *
     * @param id The model ID
     * @param model The updated model data
     * @return The updated model
     * @throws ModelNotFoundException if model not found
     */
    @Transactional
    public Model updateModel(String id, Model model) {
        Model existingModel = getModel(id);
        
        // Update fields
        if (model.getName() != null) {
            existingModel.setName(model.getName());
        }
        if (model.getDescription() != null) {
            existingModel.setDescription(model.getDescription());
        }
        if (model.getProvider() != null && model.getProvider().getId() != null) {
            Provider provider = providerService.getProvider(model.getProvider().getId());
            existingModel.setProvider(provider);
        }
        if (model.getType() != null) {
            existingModel.setType(model.getType());
        }
        if (model.getVersion() != null) {
            existingModel.setVersion(model.getVersion());
        }
        
        existingModel.setContextWindow(model.getContextWindow());
        existingModel.setMaxTokensOutput(model.getMaxTokensOutput());
        existingModel.setInputCostPer1kTokens(model.getInputCostPer1kTokens());
        existingModel.setOutputCostPer1kTokens(model.getOutputCostPer1kTokens());
        existingModel.setAverageLatencyMs(model.getAverageLatencyMs());
        
        if (model.getDefaultParameters() != null && !model.getDefaultParameters().isEmpty()) {
            existingModel.setDefaultParameters(model.getDefaultParameters());
        }
        
        existingModel.setEnabled(model.isEnabled());
        existingModel.setQualityScore(model.getQualityScore());
        
        // Update timestamp
        existingModel.setUpdatedAt(LocalDateTime.now());
        
        return modelRepository.save(existingModel);
    }

    /**
     * Update model status (enabled/disabled)
     *
     * @param id The model ID
     * @param enabled The enabled status
     * @return The updated model
     * @throws ModelNotFoundException if model not found
     */
    @Transactional
    public Model updateModelStatus(String id, boolean enabled) {
        Model model = getModel(id);
        model.setEnabled(enabled);
        model.setUpdatedAt(LocalDateTime.now());
        return modelRepository.save(model);
    }

    /**
     * Update model quality score
     *
     * @param id The model ID
     * @param qualityScore The quality score
     * @return The updated model
     * @throws ModelNotFoundException if model not found
     */
    @Transactional
    public Model updateModelQualityScore(String id, double qualityScore) {
        Model model = getModel(id);
        model.setQualityScore(qualityScore);
        model.setUpdatedAt(LocalDateTime.now());
        return modelRepository.save(model);
    }

    /**
     * Delete a model
     *
     * @param id The model ID
     * @throws ModelNotFoundException if model not found
     */
    @Transactional
    public void deleteModel(String id) {
        if (!modelRepository.existsById(id)) {
            throw new ModelNotFoundException("Model not found with ID: " + id);
        }
        modelRepository.deleteById(id);
    }

    /**
     * Find the best model for a specific type
     *
     * @param type The model type
     * @return The best model for the specified type
     */
    public Optional<Model> findBestModelForType(Model.ModelType type) {
        List<Model> models = modelRepository.findByTypeAndEnabledTrueOrderByQualityScoreDesc(type);
        return models.stream().findFirst();
    }

    /**
     * Find the best model for a specific type with minimum context window
     *
     * @param type The model type
     * @param minContextWindow The minimum context window size
     * @return The best model for the specified type with minimum context window
     */
    public Optional<Model> findBestModelForTypeWithMinContext(Model.ModelType type, int minContextWindow) {
        List<Model> models = modelRepository.findByTypeAndEnabledTrueOrderByQualityScoreDesc(type);
        return models.stream()
                .filter(model -> model.getContextWindow() >= minContextWindow)
                .findFirst();
    }

    /**
     * Find the most cost-effective model for a specific type
     *
     * @param type The model type
     * @return The most cost-effective model for the specified type
     */
    public Optional<Model> findMostCostEffectiveModel(Model.ModelType type) {
        List<Model> models = modelRepository.findByTypeAndEnabledTrue(type);
        return models.stream()
                .sorted((m1, m2) -> Double.compare(
                        (m1.getInputCostPer1kTokens() + m1.getOutputCostPer1kTokens()) / 2,
                        (m2.getInputCostPer1kTokens() + m2.getOutputCostPer1kTokens()) / 2))
                .findFirst();
    }
}
