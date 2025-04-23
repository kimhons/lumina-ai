package ai.lumina.provider.controller;

import ai.lumina.provider.model.Model;
import ai.lumina.provider.service.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for model operations
 */
@RestController
@RequestMapping("/api/models")
public class ModelController {

    private final ModelService modelService;

    @Autowired
    public ModelController(ModelService modelService) {
        this.modelService = modelService;
    }

    /**
     * Create a new model
     *
     * @param model The model to create
     * @return The created model
     */
    @PostMapping
    public ResponseEntity<Model> createModel(@RequestBody Model model) {
        Model createdModel = modelService.createModel(model);
        return new ResponseEntity<>(createdModel, HttpStatus.CREATED);
    }

    /**
     * Get a model by ID
     *
     * @param id The model ID
     * @return The model if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Model> getModel(@PathVariable String id) {
        Model model = modelService.getModel(id);
        return new ResponseEntity<>(model, HttpStatus.OK);
    }

    /**
     * Get all models
     *
     * @return List of all models
     */
    @GetMapping
    public ResponseEntity<List<Model>> getAllModels() {
        List<Model> models = modelService.getAllModels();
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models by provider
     *
     * @param providerId The provider ID
     * @return List of models for the specified provider
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Model>> getModelsByProvider(@PathVariable String providerId) {
        List<Model> models = modelService.getModelsByProvider(providerId);
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models by type
     *
     * @param type The model type
     * @return List of models of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Model>> getModelsByType(@PathVariable Model.ModelType type) {
        List<Model> models = modelService.getModelsByType(type);
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get enabled models
     *
     * @return List of enabled models
     */
    @GetMapping("/enabled")
    public ResponseEntity<List<Model>> getEnabledModels() {
        List<Model> models = modelService.getEnabledModels();
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models by provider and type
     *
     * @param providerId The provider ID
     * @param type The model type
     * @return List of models for the specified provider and type
     */
    @GetMapping("/provider/{providerId}/type/{type}")
    public ResponseEntity<List<Model>> getModelsByProviderAndType(
            @PathVariable String providerId,
            @PathVariable Model.ModelType type) {
        List<Model> models = modelService.getModelsByProviderAndType(providerId, type);
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models by minimum context window
     *
     * @param contextWindow The minimum context window size
     * @return List of models with context window size greater than or equal to specified value
     */
    @GetMapping("/context-window/{contextWindow}")
    public ResponseEntity<List<Model>> getModelsByMinContextWindow(@PathVariable int contextWindow) {
        List<Model> models = modelService.getModelsByMinContextWindow(contextWindow);
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models ordered by quality
     *
     * @return List of models ordered by quality
     */
    @GetMapping("/quality")
    public ResponseEntity<List<Model>> getModelsOrderedByQuality() {
        List<Model> models = modelService.getModelsOrderedByQuality();
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Get models by maximum cost
     *
     * @param cost The maximum cost per token
     * @return List of models with cost per token less than specified value
     */
    @GetMapping("/cost/{cost}")
    public ResponseEntity<List<Model>> getModelsByMaxCost(@PathVariable double cost) {
        List<Model> models = modelService.getModelsByMaxCost(cost);
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Update a model
     *
     * @param id The model ID
     * @param model The updated model data
     * @return The updated model
     */
    @PutMapping("/{id}")
    public ResponseEntity<Model> updateModel(
            @PathVariable String id,
            @RequestBody Model model) {
        Model updatedModel = modelService.updateModel(id, model);
        return new ResponseEntity<>(updatedModel, HttpStatus.OK);
    }

    /**
     * Update model status
     *
     * @param id The model ID
     * @param statusUpdate The status update
     * @return The updated model
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Model> updateModelStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        Boolean enabled = statusUpdate.get("enabled");
        if (enabled == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Model updatedModel = modelService.updateModelStatus(id, enabled);
        return new ResponseEntity<>(updatedModel, HttpStatus.OK);
    }

    /**
     * Update model quality score
     *
     * @param id The model ID
     * @param qualityUpdate The quality update
     * @return The updated model
     */
    @PatchMapping("/{id}/quality")
    public ResponseEntity<Model> updateModelQualityScore(
            @PathVariable String id,
            @RequestBody Map<String, Double> qualityUpdate) {
        Double qualityScore = qualityUpdate.get("qualityScore");
        if (qualityScore == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Model updatedModel = modelService.updateModelQualityScore(id, qualityScore);
        return new ResponseEntity<>(updatedModel, HttpStatus.OK);
    }

    /**
     * Delete a model
     *
     * @param id The model ID
     * @return No content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable String id) {
        modelService.deleteModel(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Find the best model for a type
     *
     * @param type The model type
     * @return The best model for the specified type
     */
    @GetMapping("/best/type/{type}")
    public ResponseEntity<Model> findBestModelForType(@PathVariable Model.ModelType type) {
        return modelService.findBestModelForType(type)
                .map(model -> new ResponseEntity<>(model, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Find the best model for a type with minimum context window
     *
     * @param type The model type
     * @param contextWindow The minimum context window size
     * @return The best model for the specified type with minimum context window
     */
    @GetMapping("/best/type/{type}/context-window/{contextWindow}")
    public ResponseEntity<Model> findBestModelForTypeWithMinContext(
            @PathVariable Model.ModelType type,
            @PathVariable int contextWindow) {
        return modelService.findBestModelForTypeWithMinContext(type, contextWindow)
                .map(model -> new ResponseEntity<>(model, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Find the most cost-effective model for a type
     *
     * @param type The model type
     * @return The most cost-effective model for the specified type
     */
    @GetMapping("/cost-effective/type/{type}")
    public ResponseEntity<Model> findMostCostEffectiveModel(@PathVariable Model.ModelType type) {
        return modelService.findMostCostEffectiveModel(type)
                .map(model -> new ResponseEntity<>(model, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
